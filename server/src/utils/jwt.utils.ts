import jwt from "jsonwebtoken"
import config from "config"
import e from "express";

const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

export interface Verify {
    valid: boolean,
    expired: boolean,
    decoded: UserDecoded | null | undefined
}

interface UserDecoded {
    _id?:string;
    email?:string;
    name?:string;
    createdAt?:string;
    updatedAt?:string;
    session?:string;
    iat?:number;
    exp?:number;
}

export function signJwt(object:Object, options?:jwt.SignOptions | undefined) {
    const token = jwt.sign(object, privateKey, {
        ...(options && options),
    }); 
    return token;

}


export function verifyJwt(token:string) {
  
    try {
        const decoded = jwt.verify(token, publicKey,(_,user:any) => {
            console.log(user)
            return user
        });
        return {
          valid: true,
          expired: false,
          decoded,
        };
      } catch (e: any) {
        console.error(e);
        return {
          valid: false,
          expired: e.message === "jwt expired",
          decoded: null,
        };
      }
 
}

/*   let decoded:UserDecoded | any = {};
        const user = jwt.verify(token,privateKey,(_,user:any) => {
            decoded = user
        })
        if(String(decoded) !== "undefined") {
            console.log("DECODED !== undefined RUNNING")
            return {
                valid: true,
                expired: false,
                decoded: decoded
            }
        }
        else{
            console.log("ELSE RUNNING")
            return {
                valid: false,
                expired: true,
                decoded: null
            }
        } */