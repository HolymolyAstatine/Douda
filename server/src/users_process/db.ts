import {Pool} from 'pg'
import dotenv from 'dotenv';
import dayjs from 'dayjs';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

interface user_data{
    id:string;
    email:string;
    nickname:string;
    school?:string|null;
    grade?:number|null;
    classroom?:number|null;
}

export const insert_user=async (idid:string,email:string,nickname:string,school?:string|null,grade?:number|null,classroom?:number|null):Promise<boolean>=>{
    const client = await pool.connect();
    school = school!==undefined ? school : null;
    grade = grade!==undefined ? grade : null;
    classroom = classroom!==undefined ? classroom : null;
    try{
        await client.query(`
            INSERT INTO users(
                Gid, email, nickname, school, grade, classroom
            ) VALUES (
                $1, $2, $3, $4, $5, $6
            )`,
            [idid,email,nickname,school,grade,classroom]
        );
        return true;

    }catch (error){
        throw error
    }finally{
        client.release();
    }

};

export const find_user_data = async (id:string,email:string):Promise<user_data[]>=>{
    const client = await pool.connect();
    try{
        const result = await client.query<user_data>(`
            SELECT * FROM users WHERE email = $1
        `, [email]);
        return result ? result.rows : [];
    }catch(error){
        throw error;
    }finally{
        client.release();
    }
};

export const update_user_data = async (Gid:string,nickname:string,school?:string|null,grade?:number|null,classroom?:number|null)=>{
    const client = await pool.connect();
    school = school!==undefined ? school : null;
    grade = grade!==undefined ? grade : null;
    classroom = classroom!==undefined ? classroom : null;
    try{
        client.query(`
            UPDATE users SET nickname = $1, school = $2, grade = $3, classroom = $4, deleted_at=$5
            WHERE Gid=$6
            `,[nickname,school,grade,classroom,null,Gid]);
    }catch(error){
        throw error;
    }finally{
        client.release();
    }
};

export const check_nickname_exists = async (nickname: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT COUNT(*) FROM users WHERE nickname = $1`, [nickname]);
        return parseInt(result.rows[0].count) > 0; // 닉네임이 존재하면 true 반환
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

export const delete_user = async (Gid: string) => {
    const query = `
    UPDATE users
    SET email = NULL,
        nickname = NULL,
        school = NULL,
        grade = NULL,
        classroom = NULL
    WHERE Gid = $1;
  `;
    try{await pool.query(query, [Gid]);}
    catch(error){throw error;}
    try{
        await delete_user_log(Gid);
    }catch(error){
        throw error
    }
};

const delete_user_log = async (Gid: string) => {
    const query = `UPDATE users SET deleted_at = NOW() WHERE Gid = $1`;
    await pool.query(query, [Gid]);
};

export const is_user_deleted_recently = async (Gid: string) => {
    const query = `SELECT deleted_at FROM users WHERE Gid = $1`;
    const result = await pool.query(query, [Gid]);
  
    if (result.rows.length === 0) {
      return false;
    }
  
    const deletedAt = result.rows[0].deleted_at;
    if (deletedAt) {
      const daysSinceDeletion = dayjs().diff(dayjs(deletedAt), 'day');
      
      return daysSinceDeletion < 30 ? `${daysSinceDeletion}` : false; // 30일 이내 삭제된 경우 true 반환
    }
  
    return false;
  };