// server/src/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";

const publicRSAKey = fs.readFileSync(path.join(__dirname, '../keys/public.pem'), 'utf8');

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ code: 401, message: "No token provided" });
    return ;
  }

  try {
    req.decoded = jwt.verify(token, publicRSAKey, { algorithms: ['RS512'] }) as JwtPayload;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ code: 401, message: "Token expired" });
      return;
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ code: 401, message: "Invalid token" });
      return;
    }
    res.status(500).json({ code: 500, message: "Server error" });
    return;
  }
};

// Extend Express Request interface to include decoded
declare global {
  namespace Express {
    interface Request {
      decoded?: JwtPayload;
    }
  }
}
