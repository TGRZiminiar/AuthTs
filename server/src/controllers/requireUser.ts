import { Request, Response, NextFunction } from "express";

export const requireUser = (req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    if(!user) {
        return res.status(403).json("User Is Required")
    }
    next();
}
