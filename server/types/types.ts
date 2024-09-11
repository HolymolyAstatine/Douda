export interface SchoolInfo {
    ATPT_OFCDC_SC_CODE: string; //시도교육청코드
    ATPT_OFCDC_SC_NM: string; //시도교육청명
    SD_SCHUL_CODE: string; //행정표준코드
    SCHUL_NM: string; //학교명
    ENG_SCHUL_NM: string; //영문학교명
    SCHUL_KND_SC_NM: string; //학교종류명
    LCTN_SC_NM: string; //시도명
    JU_ORG_NM: string; //관할조직명
    FOND_SC_NM: string; //설립명
    ORG_RDNZC: string; //도로명우편번호
    ORG_RDNMA: string; //도로명주소
    ORG_RDNDA: string; //도로명상세주소
    ORG_TELNO: string; //전화번호
    HMPG_ADRES: string; //홈페이지주소
    COEDU_SC_NM: string; //남녀공학구분명
    ORG_FAXNO: string; //팩스번호
    HS_SC_NM: string; //고등학교구분명
    INDST_SPECL_CCCCL_EXST_YN: string; // 산업체특별학급존재여부
    HS_GNRL_BUSNS_SC_NM: string; //고등학교일반전문구분명
    SPCLY_PURPS_HS_ORD_NM: string | null; //특수목적고등학교계열명
    ENE_BFE_SEHF_SC_NM: string; //입시전후기구분명
    DGHT_SC_NM: string; //주야구분명
    FOND_YMD: string; //설립일자
    FOAS_MEMRD: string; //개교기념일
    LOAD_DTM: string; //수정일자
  }