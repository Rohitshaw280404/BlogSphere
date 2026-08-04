import mongoose from "mongoose";
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(" MONGODB Successfull Connection")
    }
    catch (error) {
        console.log("MONGODB Connection failed:", error)
        process.exit(1);

    }
}

export default connectDB

