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
    shcode?:string|null;
}

export const insert_user=async (idid:string,email:string,nickname:string,school?:string|null,grade?:number|null,classroom?:number|null,SHcode?:string|null):Promise<boolean>=>{
    const client = await pool.connect();
    school = school!==undefined ? school : null;
    grade = grade!==undefined ? grade : null;
    classroom = classroom!==undefined ? classroom : null;
    SHcode = SHcode||null;
    try{
        await client.query(`
            INSERT INTO users(
                Gid, email, nickname, school, grade, classroom, shcode
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7
            )`,
            [idid,email,nickname,school,grade,classroom,SHcode]
        );
        return true;

    }catch (error){
        throw error
    }finally{
        client.release();
    }

};

export const find_user_data = async (email:string):Promise<user_data[]>=>{
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

export const update_user_data = async (Gid:string,nickname:string,school?:string|null,grade?:number|null,classroom?:number|null,SHcode?:string|null)=>{
    const client = await pool.connect();
    school = school || null;
    grade = grade || null;
    classroom = classroom ||null;
    SHcode = SHcode||null;
    const ch = await getUserByGid(Gid);
    if (ch!==null && ch.length>0 && school && ch[0].school===school){
            SHcode=ch[0].shcode;
    }
    try{
        client.query(`
            UPDATE users SET nickname = $1, school = $2, grade = $3, classroom = $4, deleted_at = $5, shcode=$7
            WHERE Gid=$6
            `,[nickname,school,grade,classroom,null,Gid,SHcode]);
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

export async function getUserIdByGid(Gid: string): Promise<number | null> {
    try {
        const query = `
            SELECT id FROM users WHERE Gid = $1;
        `;
        const res = await pool.query(query, [Gid]);

        if (res.rows.length > 0) {
            return res.rows[0].id;  // id 값 반환
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

export async function getUserNikByID(ID:number) {
    const client= await pool.connect();
    try{
        const query = `
            SELECT nickname FROM users WHERE id = $1;
        `;
        const res = await pool.query(query, [ID]);
        if (res.rows.length > 0) {
            return res.rows[0].nickname;  // id 값 반환
        } else {
            return null;
        }

    }catch(error){
        throw error;
    }finally{
        client.release();
    }
    
}

export async function getUserByGid(Gid: string): Promise<user_data[] | null> {
    try {
        const query = `
            SELECT * FROM users WHERE Gid = $1;
        `;
        const res = await pool.query(query, [Gid]);

        if (res.rows.length > 0) {
            return res.rows;  // id 값 반환
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};