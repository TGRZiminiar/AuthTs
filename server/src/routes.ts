import {Express, Request, Response} from "express"
import {requireUser} from "./controllers/requireUser"
import { createUserSessionHandler, deleteSessionHandler, getUserSesstionHandler } from "./controllers/sesstion.controller"
import { createUserhandler } from "./controllers/user.controllers"
import { authCheck } from "./middleware/authCheck"
import validateResource from "./middleware/validateResource"
import { createSessionSchema } from "./schema/session.schema"
import { createUserSchema } from "./schema/user.schema"

function routes(app : Express) {
    app.get("/check", (req:Request,res:Response) => {
        res.status(200).send("hello")
    })

    app.post("/api/users",validateResource(createUserSchema), createUserhandler);
    
    app.post("/api/sessions",validateResource(createSessionSchema), createUserSessionHandler);

    app.get("/api/sessions",authCheck, requireUser, getUserSesstionHandler)

    app.delete("/api/sessions",authCheck,requireUser,deleteSessionHandler)

}

export default routes