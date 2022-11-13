import {Request,Response} from "express"
import { CreateUserInput } from "../schema/user.schema"
import { createUser } from "../service/user.service"
import logger from "../utils/logger"

export async function createUserhandler(req:Request<{},{},CreateUserInput["body"]>,res:Response) {
    try {
        const user = await createUser(req.body)
        return res.status(200).json({user})

    } catch (error:any) {
        logger.error(error)
        return res.status(400).json("Something Went Wronge")
    }
}