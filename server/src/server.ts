import express, { Request, Response } from 'express';
import { SchoolInfo } from '../types/types'; // Import the type

const app = express();
const port:number = 3001;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
