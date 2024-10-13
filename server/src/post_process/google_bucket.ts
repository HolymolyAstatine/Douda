// server/src/post_pro/google_bucket.ts
import express, { Request, Response } from 'express';
import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { auth } from "../authMiddleware";

dotenv.config();

const router = express.Router();

// Multer 설정 (메모리 저장소 사용)
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

// Google Cloud Storage 설정
const storage = new Storage({
    keyFilename: path.join(__dirname, process.env.GOOGLE_SERVISE_KEY as string), // 서비스 계정 키 경로
    projectId: process.env.GOOGLE_PROJECT_ID,
});

//버켓 설정
const bucketName = process.env.bucketName as string;
const bucket = storage.bucket(bucketName);

// 파일 이름 변환 함수 (영어, 숫자 외의 문자는 제거하거나 인코딩)
function sanitizeFileName(filename: string): string {
    // 한글 및 특수 문자는 제거하고, 공백은 '-'로 치환
    return filename
      .replace(/[^a-zA-Z0-9]/g, '-') // 영어와 숫자 외에는 '-'로 대체
      .replace(/-+/g, '-') // 연속된 '-'는 하나로 축소
      .replace(/^-+|-+$/g, ''); // 파일명 앞뒤의 '-'는 제거
}

router.post('/file_upload',auth,upload.single('image'),async (req:Request,res:Response)=>{
    try{
        if (!req.file) {
            res.status(400).send('No file uploaded.'); //파일없음 처리
            return;
        }

        // 원본 파일 이름을 안전하게 변환
        const originalName = path.parse(req.file.originalname).name;
        const extension = path.extname(req.file.originalname);
        const safeFileName = `${sanitizeFileName(originalName)}${extension}`;

        // 고유한 파일 이름 생성
        const fileName = `${uuidv4()}_${safeFileName}`;
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
        resumable: false,
        });

        blobStream.on('error', (err) => {
            console.error('Upload error:', err);
            res.status(500).send('Failed to upload file.');
            return;
        });

        blobStream.on('finish', async () => {
            try {
              
              
              // 사용자 정의 URL 생성
              //const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`
              const publicUrl = `https://localhost:8080/post_data/files/${fileName}`; // 리버스 프록시를 사용할 URL
              res.status(200).send({ message: 'File uploaded successfully', url: publicUrl });
            } catch (err) {
              console.error('Error generating public URL:', err);
              res.status(500).send('Failed to generate public URL.');
            }
        });

        // 파일 데이터를 스트림에 작성
        blobStream.end(req.file.buffer);

    }catch(error){
        console.log(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.get('/files/:fileName', async (req: Request, res: Response)=>{
  const fileName = req.params.fileName;
    const file = bucket.file(fileName);

    try {
        // 파일이 존재하는지 확인
        const [exists] = await file.exists();
        if (!exists) {
            res.status(404).send('File not found.');
            return;
        }

        // GCS에서 파일을 스트림으로 클라이언트에 전달
        file.createReadStream()
            .on('error', (err) => {
                console.error('Error reading file from GCS:', err);
                res.status(500).send('Error retrieving file.');
            })
            .pipe(res); // 파일을 클라이언트로 스트림 전송
    } catch (error) {
        console.error('Error accessing GCS file:', error);
        res.status(500).send('Server error.');
    }
});


export default router;