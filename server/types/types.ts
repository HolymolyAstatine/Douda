export interface SchoolInfo {
  /** 시도교육청코드 */
  ATPT_OFCDC_SC_CODE: string;
  /** 시도교육청명 */
  ATPT_OFCDC_SC_NM: string;
  /** 행정표준코드 */
  SD_SCHUL_CODE: string;
  /** 학교명 */
  SCHUL_NM: string;
  /** 영문학교명 */
  ENG_SCHUL_NM: string;
  /** 학교종류명 */
  SCHUL_KND_SC_NM: string;
  /** 시도명 */
  LCTN_SC_NM: string;
  /** 관할조직명 */
  JU_ORG_NM: string;
  /** 설립명 */
  FOND_SC_NM: string;
  /** 도로명우편번호 */
  ORG_RDNZC: string;
  /** 도로명주소 */
  ORG_RDNMA: string;
  /** 도로명상세주소 */
  ORG_RDNDA: string;
  /** 전화번호 */
  ORG_TELNO: string;
  /** 홈페이지주소 */
  HMPG_ADRES: string;
  /** 남녀공학구분명 */
  COEDU_SC_NM: string;
  /** 팩스번호 */
  ORG_FAXNO: string;
  /** 고등학교구분명 */
  HS_SC_NM: string;
  /** 산업체특별학급존재여부 */
  INDST_SPECL_CCCCL_EXST_YN: string;
  /** 고등학교일반전문구분명 */
  HS_GNRL_BUSNS_SC_NM: string;
  /** 특수목적고등학교계열명 (없을 경우 null) */
  SPCLY_PURPS_HS_ORD_NM: string | null;
  /** 입시전후기구분명 */
  ENE_BFE_SEHF_SC_NM: string;
  /** 주야구분명 */
  DGHT_SC_NM: string;
  /** 설립일자 */
  FOND_YMD: string;
  /** 개교기념일 */
  FOAS_MEMRD: string;
  /** 수정일자 */
  LOAD_DTM: string;
};

export interface MealInfo{
  /** 시도교육청코드*/
  ATPT_OFCDC_SC_CODE:string;
  /** 시도교육청명 */
  ATPT_OFCDC_SC_NM:string;
  /** 행정표준코드 */
  SD_SCHUL_CODE:string;
  /** 학교명 */
  SCHUL_NM:string;
  /**식사코드 */
  MMEAL_SC_CODE:string;
  /**식사명 */
  MMEAL_SC_NM:string;
  /**급식일자 */
  MLSV_YMD:string;
  /**급식인원수 */
  MLSV_FGR:string;
  /**요리명 : 내용 사이사이에 <br/>*/
  DDISH_NM:string;
  /**원산지정보 : 내용 사이사이에 <br/>*/
  ORPLC_INFO:string;
  /**칼로리정보 */
  CAL_INFO:string;
  /**영양정보 : 내용 사이사이에 <br/>*/
  NTR_INFO:string;
  /**급식시작일자 */
  MLSV_FROM_YMD:string;
  /**급식종료일자 */
  MLSV_TO_YMD:string;
  /**수정일자 */
  LOAD_DTM:string;
};

export interface TimetableInfo{
  /** 시도교육청코드*/
  ATPT_OFCDC_SC_CODE:string;
  /** 시도교육청명*/
  ATPT_OFCDC_SC_NM:string;
  /**행정표준코드 */
  SD_SCHUL_CODE:string;
  /**학교명 */
  SCHUL_NM:string;
  /**학년도 */
  AY:string;
  /**학기 */
  SEM:string;
  /**시간표일자 */
  ALL_TI_YMD:string;
  /**주야과정명 */
  DGHT_CRSE_SC_NM:string;
  /**계열명 */
  ORD_SC_NM:string;
  /**학과명 */
  DDDEP_NM:string;
  /**학년 */
  GRADE:string;
  /**강의실명 */
  CLRM_NM:string;
  /**학급명 */
  CLASS_NM:string;
  /**교시 */
  PERIO:string;
  /**수업내용 */
  ITRT_CNTNT:string;
  /**수정일자 */
  LOAD_DTM:string;
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
  id_token?: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

interface postsdata{
  id:number;
  title:string;
  content:string;
  author_id:number;
  created_at:Date;
  updated_at:Date;
  is_deleted:boolean;
  category_id:number|null;
  tags:number|null;
  view_count:number;
  like_count:number;
  dislike_count:number;
  comment_count:number;
  nickname:string;
}