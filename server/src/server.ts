import express, { Request, Response } from 'express';
import axios from 'axios';

const API_KEY = process.env.NEIS_API_KEY;
const SCHOOL_API_URL = 'https://open.neis.go.kr/hub/schoolInfo';
const MEAL_API_URL = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
const TIMETABLE_API_URL = 'https://open.neis.go.kr/hub/';


const app = express();
const port:number = 3001;
app.use(express.json());

interface UserInputData {
  SchoolName: string;
  SchoolType: string;
}


const fetchSchoolDataAPI = async (schoolName:string,schoolType:string) => {
  try{
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
    };
    return null;
  } catch (error){
    throw new Error(`Error fetching data: ${error}`);
  }
};

const fetchMealDataAPI = async (schoolInfo:any,date: string)=>{

};

const fetchTimetableDataAPI = async (schoolInfo: any, date: string, grade: string, classNum: string)=> {

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
