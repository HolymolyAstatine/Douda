import dotenv from "dotenv";
import { Pool, QueryResult } from "pg";
import {getUserNikByID} from "../users_process/db"

dotenv.config();

interface postsdata{
    id:number;
    title:string;
    content:string;
    author_id:number;
    created_at:Date;
    updated_at:Date;
    is_deleted:boolean;
    category_id:number|null;
    tags:number|null;
    view_count:number;
    like_count:number;
    dislike_count:number;
    comment_count:number;
    nickname:string;
}

interface Comment {
    id: number;
    post_id: number;
    author_id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
    nickname:string;
  }

class PostCommentDBManager {
    private client: any;

    private pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: parseInt(process.env.DB_PORT || '5432', 10),
    });


    public async getUserIdByGid(Gid: string): Promise<number | null>{
        this.client = await this.pool.connect();
        try {
            const query = `
                SELECT id FROM users WHERE Gid = $1;
            `;
            const res = await this.client.query(query, [Gid]);
    
            if (res.rows.length > 0) {
                return res.rows[0].id;  // id 값 반환
            } else {
                console.log('User not found.');
                return null;
            }
        }catch (error) {
            console.error('Error fetching user id:', error);
            return null;
        }
    };

    public async insertPost(title: string, content: string, authorId: number, categoryId?: number | null, tags?: string | null) {
        this.client = await this.pool.connect();
        categoryId = categoryId || null;
        tags = tags || null;
        try {
            const query = `
                INSERT INTO posts (title, content, author_id, created_at, updated_at, category_id, tags, view_count, like_count, dislike_count, comment_count)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4, $5, 0, 0, 0, 0)
                RETURNING *; 
            `;
            const res = await this.client.query(query, [title, content, authorId, categoryId, tags]);
            console.log('Inserted Post:', res.rows[0]);
        } catch (error) {
            throw error;
        } finally {
            this.client.release();
        }
    }

    public async updatePost(postId: number, title?: string, content?: string, categoryId?: number | null, tags?: string | null) {
        this.client = await this.pool.connect();
        try {
            const setClause = [];
            const values = [];

            if (title) {
                setClause.push(`title = $${values.length + 1}`);
                values.push(title);
            }
            if (content) {
                setClause.push(`content = $${values.length + 1}`);
                values.push(content);
            }
            if (categoryId) {
                setClause.push(`category_id = $${values.length + 1}`);
                values.push(categoryId);
            }
            if (tags) {
                setClause.push(`tags = $${values.length + 1}`);
                values.push(tags);
            }

            values.push(postId); // 마지막 인자로 postId 추가

            const query = `
                UPDATE posts
                SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
                WHERE id = $${values.length};
            `;

            await this.client.query(query, values);
            console.log(`Post with ID ${postId} updated successfully.`);
        } catch (error) {
            throw error;
        } finally {
            this.client.release();
        }
    }

    public async deletePost(postId: number) {
        this.client = await this.pool.connect();
        try {
            const query = `
                UPDATE posts
                SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
                WHERE id = $1;
            `;
            await this.client.query(query, [postId]);
            console.log(`Post with ID ${postId} deleted successfully.`);
        } catch (error) {
            throw error;
        } finally {
            this.client.release();
        }
    }

    public async insertComment(postId: number, authorId: number, content: string) {
        this.client = await this.pool.connect();
        try {
            const query = `
                INSERT INTO comments (post_id, author_id, content, created_at, updated_at)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                RETURNING *;  
            `;
            const res = await this.client.query(query, [postId, authorId, content]);
            console.log('Inserted Comment:', res.rows[0]);
        } catch (error) {
            throw error;
        } finally {
            this.client.release();
        }
    }

    public async updateComment(commentId: number, content: string) {
        this.client = await this.pool.connect();
        try {
            const query = `
                UPDATE comments
                SET content = $1, updated_at = CURRENT_TIMESTAMP
                WHERE id = $2;
            `;
            await this.client.query(query, [content, commentId]);
            console.log(`Comment with ID ${commentId} updated successfully.`);
        } catch (error) {
            throw error;
        } finally {
            this.client.release();
        }
    }

    public async deleteComment(commentId: number) {
        this.client = await this.pool.connect();
        try {
            const query = `
                DELETE FROM comments
                WHERE id = $1;
            `;
            await this.client.query(query, [commentId]);
            console.log(`Comment with ID ${commentId} deleted successfully.`);
        } catch (error) {
            throw error;
        } finally {
            this.client.release();
        }
    }

    public async getPosts(offset: number, limit: number):Promise<postsdata[]>{
        this.client = await this.pool.connect();
        try {
            const query = `
            SELECT id, title, content, author_id, created_at, updated_at, is_deleted, 
                    category_id, tags, view_count, like_count, dislike_count, comment_count
            FROM posts
            WHERE is_deleted = false  -- Exclude deleted posts
            ORDER BY id ASC            -- Sort by id in ascending order
            OFFSET $1 LIMIT $2;
            `;

          const values = [offset, limit];  // Use offset and limit for pagination
          const res:postsdata[]=[]
      
          const { rows }:{rows:postsdata[]} = await this.client.query(query, values);
          for (const row of rows){
            const nik=await getUserNikByID(row.author_id);
            row.nickname=nik || '탈퇴한 사용자';
            console.log(nik);
            res.push(row);
          }
          return res;
        } catch (error) {
          console.error('Error fetching posts:', error);
          throw error;
        }finally{
            this.client.release();
        }
    }

    public async getPostbyid(id:number):Promise<postsdata[]|null>{
        this.client = await this.pool.connect();
        try{
            const {rows} = await this.client.query(
                'SELECT * FROM posts WHERE id = $1 AND is_deleted = false',
                [id]
              );
              const res=[]
              for (const row of rows){
                const nik=await getUserNikByID(row.author_id);
                row.nickname=nik || '탈퇴한 사용자';
                console.log(nik);
                res.push(row);
              }
              return res.length > 0 ? res[0] : null;
        }catch(error){
            throw error;
        }finally{
            this.client.release();
        }
    }

    public async getCommentsByPostId(postId: number): Promise<Comment[]> {
        const client = await this.pool.connect(); // 로컬 변수를 사용하여 클라이언트를 관리합니다.
        try {
            const {rows} = await client.query<Comment>(
                'SELECT * FROM comments WHERE post_id = $1',
                [postId]
            );
            const res=[]
            for (const row of rows){
                const nik=await getUserNikByID(row.author_id);
                row.nickname=nik || '탈퇴한 사용자';
                res.push(row);
            }
            return res; // 댓글 목록을 반환
        } catch (error) {
            console.error('Error querying comments:', error);
            throw error; // 에러를 다시 던집니다.
        } finally {
            client.release(); // 항상 클라이언트를 반환합니다.
        }
    }

    public async increaseLikeCount(postId: number): Promise<void>{
        const client = await this.pool.connect();
        try{
            await client.query('UPDATE posts SET like_count = like_count + 1 WHERE id = $1',
        [postId]);
        }catch(error){
            throw error;
        }finally{
            client.release();
        }
    }

    public async increaseDislikeCount(postId: number): Promise<void>{
        const client = await this.pool.connect();
        try{
            await client.query('UPDATE posts SET dislike_count = dislike_count + 1 WHERE id = $1',
        [postId]);
        
        }catch(error){
            throw error;
        }finally{
            client.release();
        }
    }
    
}


export default PostCommentDBManager;