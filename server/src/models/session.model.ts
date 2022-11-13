import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { UserDocument } from "./user.model";

const {ObjectId} = require("mongoose").Schema.Types

export interface SessionDocument extends mongoose.Document {
    user:UserDocument["_id"];
    valid:boolean;
    userAgent:string;
    createdAt:Date;
    updatedAt:Date;
}

const sessionSchema = new mongoose.Schema({
    user:{
        type:ObjectId,
        ref:"User"
    },
    valid:{
        type:Boolean,
        default:true
    },
    userAgent:{type:String}
},{
    timestamps:true
})


const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel