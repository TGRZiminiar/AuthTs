import { Request, Response, NextFunction } from "express";
import { refreshAccessToken } from "../service/sesstion.service";
import { verifyJwt } from "../utils/jwt.utils";


export const authCheck = async(req: Request, res: Response, next: NextFunction) => {
    
    const accessToken = req.headers['authorization']?.split(' ')[1]
    console.log("THIS IS ACCESS TOKEN",accessToken)
    const refreshToken = (req.headers["x-refresh"] as string)?.split(" ")[1];

    if(!accessToken) {
        return next();
    }

    const {decoded, expired} = verifyJwt(accessToken)
    console.log("THIS IS EXPIRED=>",expired)
    if(String(decoded) !== "null" && expired === false){
        console.log("EXPIRED FALSE RUNNING")
        req.user = decoded;
        return next();
    }
 
    if(expired === true && refreshToken){
        const newAccessToken = await refreshAccessToken(refreshToken) as string | boolean;
        if(typeof newAccessToken == "string"){
            res.setHeader("authorization",newAccessToken);
        }
        const result = verifyJwt(newAccessToken as string);
        
        req.user = result.decoded;
        return next();

    }

}