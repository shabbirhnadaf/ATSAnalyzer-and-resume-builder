import mongoose from "mongoose";
import { log } from "node:console";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI!);
    } catch (error) {
        console.error("DB connection error: ", error)
        process.exit(1);
    }
}

export default connectDB;