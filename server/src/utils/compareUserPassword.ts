import bcrypt from "bcrypt";

export async function compareUserPassword(passwordInDB:string,passwordFromReq:string): Promise<boolean> {
    return await bcrypt.compare(passwordFromReq, passwordInDB).catch((e) => false);
}