import { Pool } from 'pg';
import fs from 'fs';
import { parse } from 'csv-parse';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL 연결 설정
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// CSV 파일 경로
const csvFilePath = path.join(__dirname, '../temp/학교기본정보.csv');

// CSV 파일 읽기 및 데이터베이스에 삽입
const insertSchoolsFromCsv = async () => {
    try {
      // CSV 파일 스트림 생성
      const fileStream = fs.createReadStream(csvFilePath);
      
      // CSV 파서 설정
      const parser = parse({
        columns: (header: string[]) => header.map(col => col.trim().toLowerCase()), // 열 이름에서 공백 제거 및 소문자로 변환
        skip_empty_lines: true,
        trim: true
      });
  
      // 파일 스트림을 파서에 연결
      fileStream.pipe(parser);
  
      // PostgreSQL 클라이언트 연결
      const client = await pool.connect();
      
      // CSV 데이터를 읽고 데이터베이스에 삽입
      parser.on('data', async (row: any) => {
        //console.log('Row:', row);  // Debug: CSV 데이터 확인
  
        if (row.atpt_ofcdc_sc_code) { // 데이터가 존재하는지 확인
          try {
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
              row.atpt_ofcdc_sc_code,
              row.atpt_ofcdc_sc_nm,
              row.sd_schul_code,
              row.schul_nm,
              row.eng_schul_nm,
              row.schul_knd_sc_nm,
              row.lctn_sc_nm,
              row.ju_org_nm,
              row.fond_sc_nm,
              row.org_rdnzc,
              row.org_rdnma,
              row.org_rdnda,
              row.org_telno,
              row.hmpg_adres,
              row.coedu_sc_nm,
              row.org_faxno,
              row.hs_sc_nm,
              row.indst_specl_ccccl_exst_yn,
              row.hs_gnrl_busns_sc_nm,
              row.spcly_purps_hs_ord_nm,
              row.ene_bfe_sehf_sc_nm,
              row.dght_sc_nm,
              row.fond_ymd,
              row.foas_memrd,
              row.load_dtm
            ]);
          } catch (err) {
            console.error('Error inserting data:', err);
          }
        } else {
          console.log('Empty row or incorrect format:', row); // Debug: 빈 데이터 확인
        }
      });
  
      parser.on('end', () => {
        console.log('CSV file processing completed');
        client.release();
      });
    } catch (err) {
      console.error('Error processing CSV file:', err);
    }
  };
  
  insertSchoolsFromCsv();
