import { SchoolInfo,MealInfo } from '../../types/types';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT || '5432', 10),
  });

/**
 * 학교 정보를 검색하는 함수
 * 
 * @param {string} schoolName - 검색할 학교 이름
 * @returns {Promise<SchoolInfo[] | null>} - 검색된 학교 정보 또는 null
 * @throws {Error} - 에러 발생하면 던짐
 */
export const searchSchoolByName = async (schoolName: string): Promise<SchoolInfo[] | null> => {
    try {
      const client = await pool.connect();
  
      // 학교 이름으로 검색하는 쿼리
      const result = await client.query<SchoolInfo>(`
        SELECT * FROM schools
        WHERE LOWER(schul_nm) LIKE LOWER($1)
      `, [`%${schoolName}%`]);
  
      client.release();
  
      // 검색된 결과가 있으면 반환, 없으면 null
      if (result.rows.length > 0) {
        return result.rows;
      } else {
        return null;
      }
    } catch (err) {
        throw new Error(`Error fetching data: ${err}`);
    }
  };

/**
 * DB에 학교 정보를 저장하는 함수
 * 
 * @param {SchoolInfo} schooldata - 저장할 학교의 정보
 * @returns {Promise<boolean>} - 성공하면 true
 * @throws {Error} - 중간에 에러 발생하면 던짐
 */
export const insertSchoolInDB = async (schooldata:SchoolInfo): Promise<boolean>=>{
  try{
    const client = await pool.connect();
    try{
      await client.query(`
        INSERT INTO schools (
          atpt_ofcdc_sc_code, atpt_ofcdc_sc_nm, sd_schul_code, schul_nm, 
          eng_schul_nm, schul_knd_sc_nm, lctn_sc_nm, ju_org_nm, fond_sc_nm, 
          org_rdnzc, org_rdnma, org_rdnda, org_telno, hmpg_adres, coedu_sc_nm, 
          org_faxno, hs_sc_nm, indst_specl_ccccl_exst_yn, hs_gnrl_busns_sc_nm, 
          spcly_purps_hs_ord_nm, ene_bfe_sehf_sc_nm, dght_sc_nm, fond_ymd, 
          foas_memrd, load_dtm
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
          $18, $19, $20, $21, $22, $23, $24, $25
        )
      `, [
        schooldata.ATPT_OFCDC_SC_CODE,
        schooldata.ATPT_OFCDC_SC_NM,
        schooldata.SD_SCHUL_CODE,
        schooldata.SCHUL_NM,
        schooldata.ENG_SCHUL_NM,
        schooldata.SCHUL_KND_SC_NM,
        schooldata.LCTN_SC_NM,
        schooldata.JU_ORG_NM,
        schooldata.FOND_SC_NM,
        schooldata.ORG_RDNZC,
        schooldata.ORG_RDNMA,
        schooldata.ORG_RDNDA,
        schooldata.ORG_TELNO,
        schooldata.HMPG_ADRES,
        schooldata.COEDU_SC_NM,
        schooldata.ORG_FAXNO,
        schooldata.HS_SC_NM,
        schooldata.INDST_SPECL_CCCCL_EXST_YN,
        schooldata.HS_GNRL_BUSNS_SC_NM,
        schooldata.SPCLY_PURPS_HS_ORD_NM,
        schooldata.ENE_BFE_SEHF_SC_NM,
        schooldata.DGHT_SC_NM,
        schooldata.FOND_YMD,
        schooldata.FOAS_MEMRD,
        schooldata.LOAD_DTM
      ]);
    } catch(error){
      throw new Error(`err! ${error}`);
    } finally{
      client.release();
    }
  return true;
  } catch(error){
    throw new Error(`err! ${error}`);
  } 
};

export const finduser = async (idid:string,email:string):Promise<boolean>=>{
  const client=await pool.connect();
  try{
     const result = await client.query(`
          SELECT * FROM users WHERE email = $1
      `, [email]);
      return !!result.rows.length;
  }catch(err){
      console.log(err);
      return false;
  }finally{
      client.release();
  }
}