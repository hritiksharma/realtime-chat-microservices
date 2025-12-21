import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken';

 interface IUser extends Document { 
    _id : string; 
    name:string; 
    email:string;
 }

 export interface AuthenticatedRequest extends Request { 
    user?: IUser | null;
 }

  const isAuth = async (req:AuthenticatedRequest, res:Response, next:NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization; 
        if(!authHeader || !authHeader.startsWith('Bearer ')) { 
            res.status(401).json({ message: 'plese login- No Auth headers' });
            return; 
        }

           const token = authHeader.split(" ")[1]; 
                 if (!token) {
                     res.status(401).json({
                      message: "Please LogIn - Missing token",
                  });
                  return;
              }
                
                const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        
                if(!decodedValue || !decodedValue.user) {
                    res.status(401).json({
                        message: "Please LogIn - Invalid token",
                    });
                    return;
                }
        
                req.user = decodedValue.user;
                next();
    } catch (error) {
         res.status(401).json({
            message: "Please LogIn - JWT ERROR",
        });
    }
 }

 export default isAuth;