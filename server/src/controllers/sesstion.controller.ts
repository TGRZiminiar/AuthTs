import {Request,Response} from "express"
import { createSession, findSession } from "../service/sesstion.service";
import { validatePassword } from "../service/user.service"
import { signJwt } from "../utils/jwt.utils";
import config from "config"
import { updateSession } from "../service/sesstion.service";

//{},{},CreateUserInput["body"]
export async function createUserSessionHandler(req:Request,res:Response) {
    try {
         
    // Validate user password
    const user = await validatePassword(req.body);

    if(user === false) return res.status(401).json("Invalid Email Or Password");

    // create Sesstion
    const session = await createSession(user._id, req.get("user-agent") || "")
    // create access token
    const accessToken = signJwt(
        {...user, session:session._id},
        {expiresIn : config.get<string>("accessTokenTime")}   //1 hour
    )
    
    // create refresh token
    const refreshToken = signJwt(
        {...user, session:session._id},
        {expiresIn : config.get<string>("refreshTokenTime")}   //1 hour
    )

    // return token
    return res.status(200).json({accessToken,refreshToken})
    } catch (error) {
        console.log("GET TOKEN ERROR =>",error)
        return res.status(400).json("GET TOKEN ERROR")
    }
    
}

export async function getUserSesstionHandler(req:Request,res:Response) {
    try {

        const userId = req.user._id;
        const sessions = await findSession({user : userId, valid : true});
        return res.status(200).send(sessions);

    } catch (error) {
        console.log("GET USER SESSION ERROR =>",error);
        return res.status(400).json("GET USER SESSION ERROR");
    }
}

export async function deleteSessionHandler(req:Request,res:Response) {
    try {
        const sessionId = req.user.session;
        
        await updateSession({_id: sessionId}, {valid:false})

        return res.status(200).json({
            accessToken: null,
            refreshToken: null
        });

    } catch (error) {
        console.log("DELETE SESSION ERROR=>",error);
        return res.status(400).json("DELETE SESSION ERROR");
    }
}

