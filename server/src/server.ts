import express, { Request, Response,NextFunction } from 'express';
import { SchoolInfo,MealInfo } from '../types/types';
import winston from 'winston';
import path from 'path';
import dotenv from 'dotenv';
import {searchSchoolByName,insertSchoolInDB,searchMealData,insertMealDataInDB} from './db/db'
import {fetchSchoolDataAPI,fetchMealDataAPI,fetchTimetableDataAPI} from './apiClient'

dotenv.config();

const logDir = path.join(__dirname, '../logs');

const app = express();
const port: number = parseInt(process.env.PORT || '3000', 10);
app.use(express.json());

interface UserInputData {
  SchoolName: string;
}

interface UserInputData2{
  schoolCode:string;
  atptCode:string;
  month:string;
}

interface ApiResponseSchoolData {
  data: SchoolInfo[]|null;
  success: boolean;
}

interface ApiResponseMealData{
  data:MealInfo[]|null;
  success:boolean;
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      })
  ),
  transports: [
      // 파일에 로그 저장
      new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
      new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // 로그 파일에 에러 기록
  logger.error(`${err.message} - ${req.method} ${req.url}`);

  // 클라이언트에 에러 응답
  res.status(500).json({
      success: false,
      message: 'An internal error occurred',
  });
});

app.get('/', (req: Request, res: Response) => {
  res.status(404).send('?')
});

app.get('/api/searchSchool',async(req: Request<{}, {}, UserInputData>, res: Response,next: NextFunction)=>{
  const {SchoolName} = req.query;
  try {
      const listOfSchool = await searchSchoolByName(SchoolName as string);
      if (listOfSchool!==null){
        const resdata:ApiResponseSchoolData={
          data:listOfSchool,
          success:true
        };
        logger.info('GET /api/searchSchool called and success! (return db data)');
        res.json(resdata);
      }
      else{
        const tryAddSchool = await fetchSchoolDataAPI(SchoolName as string);
        if (tryAddSchool!==null){
          for (const inndata of tryAddSchool){
            try{
              const a = await insertSchoolInDB(inndata as SchoolInfo);
            } catch(error){
              next(error);
            }
          }
          const resdata:ApiResponseSchoolData={
            data:tryAddSchool,
            success:true
          };
          logger.info('GET /api/searchSchool called and success! (return api data and insert data in db)');
          res.json(resdata);
        }
        else{
          const resdata:ApiResponseSchoolData={
            data:null,
            success:false
            }
            logger.info('GET /api/searchSchool called but there is no data searched. 404 err');
            res.status(404).json(resdata); //검색 결과 없으면 404
        }
      }
  }catch (error){
    next(error);
  }
});

app.get('/api/searchMeal',async(req: Request<{}, {}, UserInputData2>, res: Response,next: NextFunction)=>{
  const {schoolCode,atptCode,month}=req.query;
  try{
    const monthMealData = await searchMealData(schoolCode as string,atptCode as string,month as string)
    if (monthMealData!==null){
      const resdata:ApiResponseMealData={
        data:monthMealData,
        success:true
      };
      logger.info('/api/searchMeal called and success! (return db data)');
      res.json(resdata);
    }
    else{
      
      //const tryAddMeal = await fetchMealDataAPI()
    }
  }catch (error){
    next(error);
  }

});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
