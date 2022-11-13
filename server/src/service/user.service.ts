import { DocumentDefinition } from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";
import { omit } from "lodash";
import { compareUserPassword } from "../utils/compareUserPassword";

export async function createUser(input: DocumentDefinition<Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword">>) {
    try {
        
        const user = await UserModel.create(input);

        return omit(user.toJSON(), "password");

    } catch (error:any) {

        throw new Error(error);
    
    }
}

export async function validatePassword({email,password}:{email:string,password:string}) {

    const user = await UserModel.findOne({email}).lean();

    if(!user) return false;

    const isPasswordValid = await compareUserPassword(user.password,password);
    if(isPasswordValid === false) return false;
    return omit(user, "password");

}