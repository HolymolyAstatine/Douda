// server/src/post_pro/post.ts
import express, { Request, Response } from 'express';
import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { auth } from "../authMiddleware";
import PostCommentDBManager from "./db";
import logger from '../logger';
import { error } from 'console';

dotenv.config();

const pcdbm = new PostCommentDBManager()

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

router.use((req, res, next) => {
    logger.info(`Received request: ${req.method} ${req.url}`);
    next();
});

// 파일 이름 변환 함수 (영어, 숫자 외의 문자는 제거하거나 인코딩)
function sanitizeFileName(filename: string): string {
    // 한글 및 특수 문자는 제거하고, 공백은 '-'로 치환
    return filename
      .replace(/[^a-zA-Z0-9]/g, '-') // 영어와 숫자 외에는 '-'로 대체
      .replace(/-+/g, '-') // 연속된 '-'는 하나로 축소
      .replace(/^-+|-+$/g, ''); // 파일명 앞뒤의 '-'는 제거
}

router.post('/image_upload', auth, upload.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            logger.info('No image uploaded.');
            res.status(400).send('No image uploaded.');
            return;
        }

        // 파일 확장자가 이미지 형식인지 확인
        const extension = path.extname(req.file.originalname).toLowerCase();
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
        if (!allowedExtensions.includes(extension)) {
            logger.info('Only image files are allowed.')
            res.status(400).send('Only image files are allowed.');
            return;
        }

        // 원본 파일 이름을 안전하게 변환
        const originalName = path.parse(req.file.originalname).name;
        const safeFileName = `${sanitizeFileName(originalName)}${extension}`;

        // 고유한 파일 이름 생성
        const fileName = `${uuidv4()}_${safeFileName}`;
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on('error', (err) => {
            logger.error(err)
            res.status(500).send('server error');
        });

        blobStream.on('finish', async () => {
            try {
                const publicUrl = `https://douda.kro.kr:443/post_data/files/${fileName}`; // 리버스 프록시 사용 URL
                logger.info(`Image uploaded successfully url: ${publicUrl}`);
                res.status(200).send({ code:200,message: 'Image uploaded successfully', url: publicUrl });
            } catch (err) {
                logger.error(err);
                res.status(500).send({code:500,message:'server error'});
            }
        });

        // 파일 데이터를 스트림에 작성
        blobStream.end(req.file.buffer);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ code: 500, message: 'Server error' });
    }
});

router.post('/file_upload', auth, upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).send('No file uploaded.'); // 파일이 없을 경우 처리
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
            logger.error(error);
            res.status(500).send('Failed to upload file.');
        });

        blobStream.on('finish', async () => {
            try {
                // 사용자 정의 URL 생성
                const publicUrl = `https://douda.kro.kr:443/post_data/files/${fileName}`; // 리버스 프록시를 사용할 URL
                logger.info(`Image uploaded successfully url: ${publicUrl}`)
                res.status(200).send({ message: 'File uploaded successfully', url: publicUrl });
            } catch (err) {
                logger.error(err);
                res.status(500).send('Failed to generate public URL.');
            }
        });

        // 파일 데이터를 스트림에 작성
        blobStream.end(req.file.buffer);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ code: 500, message: 'Server error' });
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
                logger.error(err);
                res.status(500).send('Error retrieving file.');
            })
            .pipe(res); // 파일을 클라이언트로 스트림 전송
    } catch (error) {
        logger.error(error);
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
    logger.info('create post success!');
    res.status(200).json({code:200,message:"create post success!"});
    return;
    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.get('/posts',async(req:Request,res:Response)=>{
    const { offset: offsetStr, limit: limitStr } = req.query;
    
    const offset = parseInt(offsetStr as string, 10) || 0;
    const limit = parseInt(limitStr as string, 10) || 20;
    try{
        const rows=await pcdbm.getPosts(offset,limit);
        if (rows.length>0){
            logger.info(`load post success!`);
            res.status(200).json({code:200,message:"load post success!",data:rows});
            return;
        }
        else{
            logger.info(`load post success!`);
            res.status(200).json({code:200,message:"load post success! but no data found.",data:[]});
            return;
        }
    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.get('/get-posts/:id',async (req:Request,res:Response)=>{
    if (!/^\d+$/.test(req.params.id as string)){
        res.status(400).json({code:400,message:"invail url"});
        return;
    }
    const id=parseInt(req.params.id as string, 10);
    
    if (!id){
        res.status(400).json({code:400,message:"id is not provide"});
        return;
    }
    try{
        const post_data=await pcdbm.getPostbyid(id);
        if(post_data){
            logger.info(`${id} post get`);
            res.status(200).json({code:200,message:"success!",data:post_data});
            return;
        }
        else{
            res.status(404).json({code:404,message:"Not found the post.",data:[]});
            return;
        }
    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.get('/get-posts/:id/comments',async (req:Request,res:Response)=>{
    if (!/^\d+$/.test(req.params.id as string)){
        res.status(400).json({code:400,message:"invail url"});
        return;
    }
    const id=parseInt(req.params.id as string, 10);
    if (!id){
        res.status(400).json({code:400,message:"id is not provide"});
        return;
    }
    try{
        const comment_row = await pcdbm.getCommentsByPostId(id);
        logger.info(`${id} load comment success! `)

        res.status(200).json({code:200,message:"load comment success!",data:comment_row});
        return;
    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.post('/posts/:id/like',auth,async (req:Request,res:Response)=>{
    const Gid: string | undefined = req.decoded?.id;
    if (!/^\d+$/.test(req.params.id as string)){
        res.status(400).json({code:400,message:"invail url"});
        return;
    }
    const id=parseInt(req.params.id as string, 10);
    if (!id){
        res.status(400).json({code:400,message:"id is not provide"});
        return;
    }
    try{
        await pcdbm.increaseLikeCount(id);
        logger.info(`${id} like success user:${Gid}`);
        res.status(200).json({code:200,message:"success"});
        return;
    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.post('/posts/:id/dislike',auth,async (req:Request,res:Response)=>{
    const Gid: string | undefined = req.decoded?.id;
    if (!/^\d+$/.test(req.params.id as string)){
        res.status(400).json({code:400,message:"invail url"});
        return;
    }
    const id=parseInt(req.params.id as string, 10);
    if (!id){
        res.status(400).json({code:400,message:"id is not provide"});
        return;
    }
    try{
        await pcdbm.increaseDislikeCount(id);
        logger.info(`${id} dislike user:${Gid}`);
        res.status(200).json({code:200,message:"success"});
        return;
    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.post('/posts/:id/comments',auth,async (req:Request,res:Response)=>{
    if (!/^\d+$/.test(req.params.id as string)){
        res.status(400).json({code:400,message:"invail url"});
        return;
    }
    const id=parseInt(req.params.id as string, 10);
    const {content}:{content:string}=req.body;
    const Gid: string | undefined = req.decoded?.id;

    try{
        const idid=await pcdbm.getUserIdByGid(Gid as string);
        await pcdbm.insertComment(id,idid as number,content);
        logger.info(`${id} comments insert success! user:${idid}`);
        res.status(200).json({code:200,message:"comments insert success!"});
        return;
    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
    }
});

router.delete('/posts/:id',auth,async(req:Request,res:Response)=>{
    if (!/^\d+$/.test(req.params.id as string)){
        res.status(400).json({code:400,message:"invail url"});
        return;
    }
    const id=parseInt(req.params.id as string, 10);
    const Gid: string | undefined = req.decoded?.id;

    if (!id || !Gid){
        res.status(400).json({code:400,message:"E"});
        return;
    }

    try{
        pcdbm.deletePost(id);
        logger.info(`${id} post delete`)
        res.status(200).json({code:200,message:"delete success"});
        return;
    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
        return;
    }
});

router.delete('/posts/:id/comments/:commentId',auth,async(req:Request,res:Response)=>{
    if (!/^\d+$/.test(req.params.id as string) || !/^\d+$/.test(req.params.commentId as string)){
        res.status(400).json({code:400,message:"invail url"});
        return;
    }
    const id=parseInt(req.params.id as string, 10);
    const commentid = parseInt(req.params.commentId as string,10);
    const Gid: string | undefined = req.decoded?.id;

    if(!id || !commentid || !Gid){
        res.status(400).json({code:400,message:"E"});
        return;
    }

    try{
        await pcdbm.deleteComment(commentid);
        logger.info(`${id} post ${commentid} delete `);
        res.status(200).json({code:200,message:"comment delete success!"});
        return;

    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
        return;
    }
    
});

router.put('/posts/:id/comments/:commentId',auth,async(req:Request,res:Response)=>{
    if (!/^\d+$/.test(req.params.id as string) || !/^\d+$/.test(req.params.commentId as string)){
        res.status(400).json({code:400,message:"invail url"});
        return;
    }
    const id=parseInt(req.params.id as string, 10);
    const commentid = parseInt(req.params.commentId as string,10);
    const Gid: string | undefined = req.decoded?.id;
    const {content}:{content:string}=req.body;

    if(!id || !commentid || !Gid){
        res.status(400).json({code:400,message:"E"});
        return;
    }

    try{
        await pcdbm.updateComment(commentid,content);
        logger.info(`${id} post ${commentid} update`);
        res.status(200).json({code:200,message:"comment update success!"});
        return;

    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
        return;
    }

});

router.put('/update_post/:id',auth,async(req:Request,res:Response)=>{
    if (!/^\d+$/.test(req.params.id as string)){
        res.status(400).json({code:400,message:"invail url"});
        return;
    }
    const id=parseInt(req.params.id as string, 10);
    const Gid: string | undefined = req.decoded?.id;
    const {title, content} : {title:string,content:string}=req.body;

    if(!id || !Gid || !title || ! content){
        res.status(400).json({code:400,message:"E"});
        return;
    }

    try{
        await pcdbm.updatePost(id,title,content);
        logger.info(`${id} post update`);
        res.status(200).json({code:200,message:"update post success!"});
        return;

    }catch(error){
        logger.error(error);
        res.status(500).json({code:500,message:"server error"});
        return;
    }

});


export default router;