//server/src/users_pro/users.ts
import express, { Request, Response } from 'express';
import { insert_user,update_user_data,check_nickname_exists,delete_user,getUserIdByGid } from "./db";
import { auth } from "../authMiddleware";

const router = express.Router();

router.post('/signup_setting',async (req: Request, res: Response) => {
    const { Gid, email, nickname, school, grade, classroom,SHcode }: { Gid: string, email: string, nickname: string, school?: string, grade?: number, classroom?: number,SHcode?:string } = req.body;

    if (!Gid || !email || !nickname ) {
        res.status(400).json({ message: 'All fields are required' });
        console.log('s')
        return;
    }

    try{
        await insert_user(Gid,email,nickname,school,grade,classroom);
        res.status(200).json({code:200,message:"success!"});
        return;

    }catch(error){
        console.log(error);
        res.status(500).json({code:500,message:"server error"});
        return;
    }

});

router.put('/profile_update', auth, async (req: Request, res: Response) => {
    const { nickname, school, grade, classroom }: { nickname: string; school?: string; grade?: number; classroom?: number } = req.body;
    const Gid: string | undefined = req.decoded?.id;

    if (!nickname) {
        res.status(400).json({ code: 400, message: "nickname required" });
        return;
    }

    try {
        const exists = await check_nickname_exists(nickname);
        if (exists) {
            res.status(400).json({ code: 400, message: "Nickname already taken." });
            return;
        }

        await update_user_data(Gid as string, nickname, school, grade, classroom);
        res.status(200).json({ code: 200, message: "update success!" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "server error" });
        return;
    }
});

router.delete('/delete_account', auth, async (req: Request, res: Response) => {
    const Gid: string | undefined = req.decoded?.id;

    if (!Gid) {
        res.status(400).json({ code: 400, message: "User ID is required" });
        return;
    }

    try {
        // 계정 삭제 처리 (삭제 시간 기록)
        await delete_user(Gid);
        res.status(200).json({ code: 200, message: "Account successfully deleted. You cannot sign up again for 30 days." });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Server error" });
        return;
    }
});

router.get('/auth/user',auth,async (req:Request,res:Response)=>{
    const Gid: string | undefined = req.decoded?.id;
    if(!Gid){
        res.status(400).json({code:400,message:"Gid is not provide"});
        return;
    }
    try{
        const authid = await getUserIdByGid(Gid as string);
        res.status(200).json({code:200,message:"success!",id:authid});
        return;

    }catch(error){
        console.log(error);
        res.status(500).json({code:500,message:"server error"});
    }

});

export default router;