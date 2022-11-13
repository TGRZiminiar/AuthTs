import SessionModel,{SessionDocument} from "../models/session.model";
import { FilterQuery,UpdateQuery } from "mongoose"
import {  signJwt, Verify, verifyJwt } from "../utils/jwt.utils";
import UserModel from "../models/user.model";
import config from "config";

export async function createSession(userId:string,userAgent:string) {
    const session = await new SessionModel({
        user:userId,
        userAgent
    }).save();
    return session.toJSON();
}

export async function findSession(query:FilterQuery<SessionDocument>) {
    return await SessionModel.find(query).lean();
}

export function updateSession (query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
    return SessionModel.updateOne(query, update);
}

export async function refreshAccessToken(refreshToken:string)  {
    console.log("REFRESHTOKEN ACTIVATE")
    const {decoded} =  verifyJwt(refreshToken) as Verify;
    if(!decoded || !decoded._id) return false;

    const session = await SessionModel.findById(decoded.session).lean();

    if(!session || !session.valid) return false;

    const user = await UserModel.findOne({ _id:session.user }).lean();

    if(!user) return false;

    const accessToken = signJwt(
        {...user,session:session._id,},
        {expiresIn : config.get<string>("accessTokenTime")}   //1 hour
    )
    return accessToken;
}

/* 
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmQ1ODI1OTA1ZGM5YzQ3NmZhMGJmMzMiLCJlbWFpbCI6IjEyM0BnbWFpbC5jb20iLCJuYW1lIjoiSmFuZSBEb2UiLCJjcmVhdGVkQXQiOiIyMDIyLTA3LTE4VDE1OjU1OjA1LjgwN1oiLCJ1cGRhdGVkQXQiOiIyMDIyLTA3LTE4VDE1OjU1OjA1LjgwN1oiLCJfX3YiOjAsInNlc3Npb24iOiI2MmQ2YjBhYzhiZjFkM2JkNmJjMzQ5ZjciLCJpYXQiOjE2NTgyMzcxMDAsImV4cCI6MTY1ODIzNzE2MH0.A74K0gfV8c7akLsKN_O5C6K_397ai_9auEeQYAUU7AA"
*/