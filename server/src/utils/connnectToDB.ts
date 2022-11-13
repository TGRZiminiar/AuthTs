import mongoose from "mongoose";
import config from "config";

async function connectTODB() {
    const DB = config.get<string>("DB");

    try {
        await mongoose.connect(DB)
        .then(() => console.log("Connected To DB"))

    } catch (error) {
        console.log("CONNECT TO DB ERROR =>",error);
        process.exit(1);
    }

}

export default connectTODB;