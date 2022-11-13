require("dotenv").config();
import express,{Application} from "express";
import config from "config";
import connectTODB from "./utils/connnectToDB";
import logger from "./utils/logger";
import routes from "./routes";
import morgan from "morgan"
// const crypto = require('crypto');

// const token = crypto.randomBytes(64).toString('hex');
// console.log(token)

const app = express()

const port = config.get("port")

app.use(express.json());
app.use(morgan('combined'))

app.listen(port, async () => {
    try {
        await connectTODB();
        logger.info(`SERVER START AT ${port}`);
        routes(app)
    } catch (error) {
        logger.error("CONNECT TO DB ERROR =>",error);
        process.exit(1);
    }
})

