import express, { Request, Response,NextFunction } from 'express';
import { GoogleTokenResponse,GoogleUserInfo } from '../types/types';
import winston from 'winston';
import path from 'path';
import dotenv from 'dotenv';
import https from 'https';
import { auth } from "./authMiddleware";
import jwt from "jsonwebtoken";
import cors from 'cors';
import fs from 'fs';
import axios from 'axios';
import {finduser} from './db/db'
import { find_user_data,is_user_deleted_recently } from "./users_process/db";
import UserRouter from "./users_process/users";
import PostRouter from "./post_process/post"
import APIRouter from "./api/api"


dotenv.config();

// SSL 인증서 파일 경로 설정
const privateKey = fs.readFileSync(path.join(__dirname, process.env.privateKey as string), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, process.env.certificate as string), 'utf8');

// Load RSA keys for RS512
const privateRSAKey = fs.readFileSync(path.join(__dirname, process.env.privateRSAKey as string), 'utf8');
const publicRSAKey = fs.readFileSync(path.join(__dirname, process.env.publicRSAKey as string), 'utf8');

const credentials = { key: privateKey, cert: certificate };



//cors config
const corsOptions = {
  origin: ['https://localhost:443','https://localhost'], // 허용할 도메인
  methods: ['GET', 'POST','PUT','DELETE'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 등 credentials 사용 허용
};

//google oauth
const GOOGLE_CLIENT_ID = process.env.ClientID || '';
const GOOGLE_CLIENT_SECRET = process.env.Clientsecret || '';
const GOOGLE_LOGIN_REDIRECT_URI = 'https://localhost:443/auth/google/login/redirect';
const GOOGLE_SIGNUP_REDIRECT_URI = 'https://localhost:443/auth/google/signup/redirect';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

const logDir = path.join(__dirname, '../logs');

const app = express();


app.use(express.json());
app.use(cors(corsOptions));

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
app.use('/user_data', UserRouter);
app.use('/post_data', PostRouter);
app.use('/api',APIRouter);



app.get('/login-server', (req: Request, res: Response) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_LOGIN_REDIRECT_URI}`;
  url += '&response_type=code';
  url += '&scope=email profile';
  res.redirect(url);
});

app.get('/signup-server', (req: Request, res: Response) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_SIGNUP_REDIRECT_URI}`;
  url += '&response_type=code';
  url += '&scope=email profile';
  res.redirect(url);
});

app.get('/auth/google/login/redirect-server', async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    res.status(400).json({ code:400,error: 'Authorization code is missing' });
  }

  try {
    const tokenResponse = await axios.post<GoogleTokenResponse>(GOOGLE_TOKEN_URL, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_LOGIN_REDIRECT_URI,
      grant_type: 'authorization_code',
    });
    const tokenData = tokenResponse.data;
    const userResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    const userInfo = userResponse.data as GoogleUserInfo;
    const { id, email } = userInfo;
    if (!await finduser(id, email)) {
      res.status(404).json({ code: 404, message: "User not found" });
      return;
    }

    const token = jwt.sign(
      { id, email },
      privateRSAKey,
      { algorithm: 'RS512', expiresIn: "12h", issuer: "your_issuer" }
    );
    res.status(200).json({ code: 200, message: "Token created", token });
  } catch (err:any) {
    logger.error(err);
    res.status(500).json({ code: 500,message:"server error" });
  }
});

app.get('/auth/google/signup/redirect-server', async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    res.status(404).json({ error: 'Authorization code is missing' });
  }

  try {
    const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
      grant_type: 'authorization_code',
    });
    const tokenData = tokenResponse.data as GoogleTokenResponse;
    const userResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userInfo = userResponse.data as GoogleUserInfo;
    const { id, email } = userInfo;
    const ded=await is_user_deleted_recently(id)
    if (ded) {
      res.status(400).json({code:400, message:`You cannot sign up again for ${ded} days.`});
      return;
    }

    if (await finduser(id, email)) {
      res.status(409).json({ code: 409, message: "User already exists" });
      return;
    } else {
      res.status(200).json({ code: 200, message: "ok", id, email });
    }
  } catch (err:any) {
    logger.error(err);
    res.status(500).json({ code: 'server error' });
  }
});

app.get('/profile-server', auth, async(req: Request, res: Response) => {
  const id:string|undefined = req.decoded?.id;
  const email:string|undefined = req.decoded?.email;

  if (!id || !email) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const user_data = await find_user_data(email as string);
  try{
  if (user_data.length>0){
      const {id,email,nickname,school,grade,classroom}=user_data[0];
      res.status(200).json({code:200,data:{id,email,nickname,school,grade,classroom}});
      return;
    }
  else{
      res.status(500).json({code:500,message:"why?"});
    }
  }catch(error){
    logger.error(error);
    res.status(500).json({code:500,message:"server error"});
  }
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
const PORT = 443;
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
