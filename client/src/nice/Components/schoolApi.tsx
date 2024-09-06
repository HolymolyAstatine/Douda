import axios from 'axios';

const API_KEY = process.env.REACT_APP_NEIS_API_KEY; // 환경 변수에서 API 키를 가져옵니다.
const SCHOOL_API_URL = 'https://open.neis.go.kr/hub/schoolInfo';
const MEAL_API_URL = 'https://open.neis.go.kr/hub/mealServiceDietInfo';

export const searchSchool = async (schoolName: string, schoolType: string) => {
  try {
    const response = await axios.get(SCHOOL_API_URL, {
      params: {
        KEY: API_KEY,
        Type: 'json',
        SCHUL_NM: schoolName,
        SCHUL_KND_SC_NM: schoolType,
      },
    });

    if (response.data.schoolInfo && response.data.schoolInfo[1].row) {
      return response.data.schoolInfo[1].row[0];
    }
    return null;
  } catch (error) {
    console.error('학교 검색 중 오류 발생:', error);
    throw error;
  }
};

export const searchMeal = async (schoolInfo: any, date: string) => {
  try {
    const response = await axios.get(MEAL_API_URL, {
      params: {
        KEY: API_KEY,
        Type: 'json',
        ATPT_OFCDC_SC_CODE: schoolInfo.ATPT_OFCDC_SC_CODE,
        SD_SCHUL_CODE: schoolInfo.SD_SCHUL_CODE,
        MLSV_YMD: date.replace(/-/g, ''),
      },
    });

    if (response.data.mealServiceDietInfo && response.data.mealServiceDietInfo[1].row) {
      return response.data.mealServiceDietInfo[1].row;
    }
    return [];
  } catch (error) {
    console.error('급식 정보 검색 중 오류 발생:', error);
    throw error;
  }
};