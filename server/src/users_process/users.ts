//server/src/users_process/users.ts
import express, { Request, Response } from 'express';
import { insert_user, update_user_data, check_nickname_exists, delete_user } from "./db";
import { auth } from "../authMiddleware";
import winston from 'winston';
import path from 'path';

const router = express.Router();

// logger 설정
const logDir = path.join(__dirname, '../../logs'); // 로그 파일 경로 조정
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
    ],
});

// 회원가입 설정
router.post('/signup_setting', async (req: Request, res: Response) => {
    const { Gid, email, nickname, school, grade, classroom } = req.body;

    if (!Gid || !email || !nickname) {
        res.status(400).json({ message: 'All fields are required' });
        logger.error('Required fields missing in signup_setting');
        return;
    }

    try {
        await insert_user(Gid, email, nickname, school, grade, classroom);
        res.status(200).json({ code: 200, message: "success!" });
    } catch (error) {
        logger.error(`Error in signup_setting: ${error}`);
        res.status(500).json({ code: 500, message: "server error" });
    }
});

// 프로필 업데이트
router.put('/profile_update', auth, async (req: Request, res: Response) => {
    const { nickname, school, grade, classroom } = req.body;
    const Gid: string | undefined = req.decoded?.id;

    if (!nickname) {
        res.status(400).json({ code: 400, message: "nickname required" });
        logger.error('Nickname missing in profile_update');
        return;
    }

    try {
        const exists = await check_nickname_exists(nickname);
        if (exists) {
            res.status(400).json({ code: 400, message: "Nickname already taken." });
            logger.info(`Nickname "${nickname}" already taken`);
            return;
        }

        await update_user_data(Gid as string, nickname, school, grade, classroom);
        res.status(200).json({ code: 200, message: "update success!" });
    } catch (error) {
        logger.error(`Error in profile_update: ${error}`);
        res.status(500).json({ code: 500, message: "server error" });
    }
});

// 계정 삭제
router.delete('/delete_account', auth, async (req: Request, res: Response) => {
    const Gid: string | undefined = req.decoded?.id;

    if (!Gid) {
        res.status(400).json({ code: 400, message: "User ID is required" });
        logger.error('User ID missing in delete_account');
        return;
    }

    try {
        await delete_user(Gid);
        res.status(200).json({ code: 200, message: "Account successfully deleted. You cannot sign up again for 30 days." });
    } catch (error) {
        logger.error(`Error in delete_account: ${error}`);
        res.status(500).json({ code: 500, message: "Server error" });
    }
});

export default router;
