import mongoose from "mongoose";

async function connectDB() {
    try {
        // ✅ env check yahan andar hona chahiye
        if (!process.env.MONGODB_URI) {
            throw new Error("Please provide MONGODB_URI in the .env file");
        }

        await mongoose.connect(process.env.MONGODB_URI)

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
        process.exit(1);
    }
}

export default connectDB;