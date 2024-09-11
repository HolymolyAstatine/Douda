import express, { Request, Response } from 'express';
import { SchoolInfo } from '../types/types';
import axios from 'axios';

const API_KEY = process.env.NEIS_API_KEY; //key
const SCHOOL_API_URL = 'https://open.neis.go.kr/hub/schoolInfo'; //학교검색 api링크
const MEAL_API_URL = 'https://open.neis.go.kr/hub/mealServiceDietInfo'; //학교급식 api링크
const TIMETABLE_API_URL = 'https://open.neis.go.kr/hub/'; //시간표 api링크


const app = express();
const port:number = 3001; //포트 3001
app.use(express.json());

interface UserInputData {
  SchoolName: string;
  SchoolType: string;
}

/**
 * 학교 정보를 가지고 오는 비동기 함수
 * 
 * @param {string} schoolName 학교명
 * @param {string} schoolType 학교급
 * @returns {Promise<Array<Array<string>> | null>} 결과있으면 리스트로 반환 / 검색결과 없으면 null
 * @throws {Error} api호출중 발생하는 오류 던짐
 */
const fetchSchoolDataAPI = async (schoolName:string,schoolType:string): Promise<Array<Array<string>> | null> => {
  try{
    const response = await axios.get(SCHOOL_API_URL, {
      params: {
        KEY: API_KEY,
        Type: 'json',
        SCHUL_NM: schoolName,
        SCHUL_KND_SC_NM: schoolType,
      },
    }); //api서버로 요청

    if (response.data.schoolInfo && response.data.schoolInfo[1].row) {
      return response.data.schoolInfo[1].row[0]; //결과 있으면 결과반환
    };
    return null; //결과 없으면 null
  } catch (error){
    throw new Error(`Error fetching data: ${error}`);
  };
};
/**
 * 학교급식을 가지고 오는 비동기 함수
 * 
 * @param {SchoolInfo} schoolInfo 학교정보 fetchSchoolDataAPI에서 가져와야함.
 * @param {string} date 급식 검색 날짜 (???형식)
 * @returns {Promise<Array<Array<string>>>} 결과있으면 리스트로 반환, 없으면 빈리스트
 * @throws {Error} api호출중 생기는 에러 던짐
 */
const fetchMealDataAPI = async (schoolInfo:SchoolInfo, date: string):Promise<Array<Array<string>>>=>{
  try{
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
    };

    return [];
  } catch(error){
    throw new Error(`Error fetching data: ${error}`);
  };
};
/**
 * 시간표 들고오는 비동기함수
 * 
 * @param {SchoolInfo} schoolInfo 학교정보: fetchSchoolDataAPI에서 가져와야함.
 * @param {string} date 검색할 날짜 (????형식)
 * @param {string} grade 학년
 * @param {string} classNum 반
 * @returns {Promise<Array<Array<string>>>} 결과있으면 결과리스트 없으면 빈리스트
 * @throws {Error} api호출중 에러발생시 던짐/지원하지 않는 학교급이면 던짐
 */
const fetchTimetableDataAPI = async (schoolInfo: SchoolInfo, date: string, grade: string, classNum: string):Promise<Array<Array<string>>>=> {
  try {
    let timetableType;
    switch (schoolInfo.SCHUL_KND_SC_NM) {
      case '초등학교':
        timetableType = 'elsTimetable';
        break;
      case '중학교':
        timetableType = 'misTimetable';
        break;
      case '고등학교':
        timetableType = 'hisTimetable';
        break;
      default:
        throw new Error(`Error Type of school not supported`);
    }

    const response = await axios.get(`${TIMETABLE_API_URL}${timetableType}`, {
      params: {
        KEY: API_KEY,
        Type: 'json',
        ATPT_OFCDC_SC_CODE: schoolInfo.ATPT_OFCDC_SC_CODE,
        SD_SCHUL_CODE: schoolInfo.SD_SCHUL_CODE,
        ALL_TI_YMD: date.replace(/-/g, ''),
        GRADE: grade,
        CLASS_NM: classNum,
      },
    });

    if (response.data[timetableType] && response.data[timetableType][1].row) {
      return response.data[timetableType][1].row;
    }
    return [];
  } catch(error){
    throw new Error(`Error fetching data: ${error}`);
  }
};

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.get('/searchSchool',(req: Request<{}, {}, UserInputData>, res: Response)=>{
  const {SchoolName,SchoolType} = req.body;

});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
