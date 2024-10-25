import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { auth } from "../authMiddleware";
import { fetchSchoolDataAPI,fetchMealDataAPI,fetchTimetableDataAPI,fetchMealDataAPI_day } from "./apiClient";
import { SchoolInfo, MealInfo, TimetableInfo } from '../../types/types';
import { find_user_data } from "../users_process/db";
import logger from '../logger';

dotenv.config();

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
    data:Array<MealInfo[]|null>;
    success:boolean;
  }



const router = express.Router();

router.use((req, res, next) => {
    logger.info(`Received request: ${req.method} ${req.url}`);
    next();
});

router.get('/searchSchool',async (req:Request,res:Response)=>{
    const {SchoolName} = req.query;
    if (!SchoolName){
        res.status(400).json({code:400,message:"SchoolName missing"});
        return;
    }

    try{
        const tryAddSchool = await fetchSchoolDataAPI(SchoolName as string);
        if (tryAddSchool!==null){
            res.status(200).json({code:200,messsage:"success",data:tryAddSchool});
            return;
        }
        else{
            res.status(200).json({code:200,message:"success",data:[]});
            return;
        }
    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error",data:[]});
        return;
    }

});

router.get('/searchMeal',auth,async(req:Request,res:Response)=>{
    const Gid: string | undefined = req.decoded?.id;
    const email:string|undefined =req.decoded?.email;
    const {month,year} = req.query;

    if(!Gid || !email || !month || !year){
        res.status(400).json({code:400,message:"no month or year"});
        return;
    }

    try{
        const user_datal= await find_user_data(email as string);
        const SHcode= user_datal[0].shcode;
        const SHname:string|undefined|null = user_datal[0].school;
        if(!SHcode){
            res.status(400).json({code:400,message:"school not found. pls update your school"});
            return;
        }
        const SHinfo = await fetchSchoolDataAPI(SHname as string);
        if (SHinfo===null){
            res.status(404).json({code:404,message:"school not found. pls update your school"});
            return;
        }
        else if(SHinfo.length>0){
            for(const row of SHinfo){
                if (row.SD_SCHUL_CODE===SHcode){
                    const rdata = await fetchMealDataAPI(SHcode,row.ATPT_OFCDC_SC_CODE,month as string,year as string);
                    logger.info(`success`);
                    res.status(200).json({code:200,message:"success",data:rdata});
                    return;
                }
            }
        }
        else{
            res.status(404).json({code:404,message:"school not found. pls update your school"});
            return;
        }
        
        res.status(500).json({code:500,message:"server error"});


        

    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
        return;
    }




});

router.get('/searchTimeTable',auth,async(req:Request,res:Response)=>{
    const Gid: string | undefined = req.decoded?.id;
    const email:string|undefined =req.decoded?.email;
    const {date} = req.query;
    if (!Gid || !email || !date){
        res.status(400).json({code:400,message:"missing data"});
        return;
    }
    try{
        const user_datal= await find_user_data(email as string);
        const {school,grade,classroom,shcode} = user_datal[0];
        if (!school || !grade || !classroom){
            res.status(400).json({code:400,message:"E"});
            return;
        }
        const SHinfo = await fetchSchoolDataAPI(school as string);
        if (SHinfo===null){
            res.status(404).json({code:404,message:"school not found. pls update your school"});
            return;
        }
        else if(SHinfo.length>0){
            for(const row of SHinfo){
                if (row.SD_SCHUL_CODE===shcode){
                    const rdata = await fetchTimetableDataAPI(row,date as string,`${grade}`,`${classroom}`);
                    logger.info('success')
                    res.status(200).json({code:200,message:"success",data:rdata});
                    return;
                }
            }
        }
        else{
            res.status(404).json({code:404,message:"school not found. pls update your school"});
            return;
        }
        res.status(500).json({code:500,message:"server error"});

    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
        return;
    }
});

router.get('/searchMeal-day',auth,async(req:Request,res:Response)=>{
    const Gid: string | undefined = req.decoded?.id;
    const email:string|undefined =req.decoded?.email;
    const {month,year,day} = req.query;

    if(!Gid || !email || !month || !year || !day){
        res.status(400).json({code:400,message:"no month or year"});
        return;
    }

    try{
        const user_datal= await find_user_data(email as string);
        const SHcode= user_datal[0].shcode;
        const SHname:string|undefined|null = user_datal[0].school;
        if(!SHcode){
            res.status(400).json({code:400,message:"school not found. pls update your school"});
            return;
        }
        const SHinfo = await fetchSchoolDataAPI(SHname as string);
        if (SHinfo===null){
            res.status(404).json({code:404,message:"school not found. pls update your school"});
            return;
        }
        else if(SHinfo.length>0){
            for(const row of SHinfo){
                if (row.SD_SCHUL_CODE===SHcode){
                    const rdata = await fetchMealDataAPI_day(SHcode,row.ATPT_OFCDC_SC_CODE,month as string,year as string,day as string);
                    logger.info(`success`);
                    res.status(200).json({code:200,message:"success",data:rdata});
                    return;
                }
            }
        }
        else{
            res.status(404).json({code:404,message:"school not found. pls update your school"});
            return;
        }
        
        res.status(500).json({code:500,message:"server error"});


        

    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
        return;
    }




});


export default router;