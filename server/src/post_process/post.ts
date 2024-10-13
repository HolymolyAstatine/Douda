// server/src/post_process/post.ts
import express, { Request, Response } from 'express';
import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { auth } from "../authMiddleware";
import PostCommentDBManager from "./db";

dotenv.config();

const pcdbm = new PostCommentDBManager()

const router = express.Router();

// Multer 설정 (메모리 저장소 사용)
const upload = multer({ storage: multer.memoryStorage() });

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

router.post('/file_upload', auth, upload.single('file'), async (req, res) => {
    try {
        // 업로드된 파일이 있는지 확인
        if (!req.file) {
            res.status(400).send('No file uploaded.'); // 파일없음 처리
            return ;
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
            contentType: req.file.mimetype === 'text/plain' ? 'text/plain; charset=utf-8' : req.file.mimetype,
            metadata: {
                contentType: req.file.mimetype === 'text/plain' ? 'text/plain; charset=utf-8' : req.file.mimetype,
                cacheControl: 'no-cache',
            },
        });

        // UTF-8로 인코딩된 파일 처리
        const buffer = req.file.buffer.toString('utf-8');

        blobStream.on('error', (err) => {
            console.error('Upload error:', err);
            res.status(500).send('Failed to upload file.');
            return ;
        });

        blobStream.on('finish', () => {
            const publicUrl = `https://localhost:8080/post_data/files/${fileName}`; // 리버스 프록시를 사용할 URL
            res.status(200).send({ message: 'File uploaded successfully', url: publicUrl });
            return ;
        });

        // 파일 데이터를 스트림에 작성
        blobStream.end(Buffer.from(buffer, 'utf-8')); // UTF-8 인코딩으로 파일 데이터 전송

    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 500, message: "Server error" });
        return ;
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

router.post('/create_post',auth,async (req:Request,res:Response)=>{
    const {title, content} : {title:string,content:string}=req.body;
    const Gid: string | undefined = req.decoded?.id;

    if (!title || !content){
        res.status(400).json({code:400,message:"title or content is not provide."});
        return;
    }
    try{
    const idid=await pcdbm.getUserIdByGid(Gid as string);
    pcdbm.insertPost(title,content,idid as number)
    res.status(200).json({code:200,message:"create post success!"});
    return;
    }catch(error){
        console.log(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.get('/posts',async(req:Request,res:Response)=>{
    const { offset: offsetStr, limit: limitStr } = req.query;
    const offset = parseInt(offsetStr as string, 10) || 0;
    const limit = parseInt(limitStr as string, 10) || 10;
    try{
        const rows=await pcdbm.getPosts(offset,limit);
        if (rows.length>0){
            res.status(200).json({code:200,message:"load post success!",data:rows});
            return;
        }
        else{
            res.status(200).json({code:200,message:"load post success! but no data found.",data:[]});
            return;
        }
    }catch(error){
        console.log(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.get('/posts/:id',async (req:Request,res:Response)=>{
    const id=parseInt(req.params.id as string, 10);
    if (!id){
        res.status(400).json({code:400,message:"id is not provide"});
        return;
    }
    try{
        const post_data=await pcdbm.getPostbyid(id);
        if(post_data){
            res.status(200).json({code:200,message:"success!",data:post_data});
            return;
        }
        else{
            res.status(404).json({code:404,message:"Not found the post.",data:[]});
            return;
        }
    }catch(error){
        console.log(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.get('/posts/:id/comments',async (req:Request,res:Response)=>{
    const id=parseInt(req.params.id as string, 10);
    if (!id){
        res.status(400).json({code:400,message:"id is not provide"});
        return;
    }
    try{
        const comment_row = await pcdbm.getCommentsByPostId(id);
        res.status(200).json({code:200,message:"load comment success!",data:comment_row});
        return;
    }catch(error){
        console.log(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.post('/posts/:id/like',auth,async (req:Request,res:Response)=>{
    const id=parseInt(req.params.id as string, 10);
    if (!id){
        res.status(400).json({code:400,message:"id is not provide"});
        return;
    }
    try{
        await pcdbm.increaseLikeCount(id);
        res.status(200).json({code:200,message:"success"});
        return;
    }catch(error){
        console.log(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.post('/posts/:id/dislike',auth,async (req:Request,res:Response)=>{
    const id=parseInt(req.params.id as string, 10);
    if (!id){
        res.status(400).json({code:400,message:"id is not provide"});
        return;
    }
    try{
        await pcdbm.increaseDislikeCount(id);
        res.status(200).json({code:200,message:"success"});
        return;
    }catch(error){
        console.log(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.post('/posts/:id/comments',auth,async (req:Request,res:Response)=>{
    const id=parseInt(req.params.id as string, 10);
    const {content}:{content:string}=req.body;
    const Gid: string | undefined = req.decoded?.id;

    try{
        const idid=await pcdbm.getUserIdByGid(Gid as string);
        await pcdbm.insertComment(id,idid as number,content);
        res.status(200).json({code:200,message:"comments insert success!"});
        return;
    }catch(error){
        console.log(error);
        res.status(500).json({code:500,message:"server error"});
    }
})

export default router;