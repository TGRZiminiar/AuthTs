import { Request } from "express"
import { UserDocument } from "../models/user.model"
export interface IGetUserAuthInfoRequest extends Request {
  user: UserDocument // or any other type
}