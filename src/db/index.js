import mongoose from "mongoose";
import { DB_NAME } from "../utils/constant.js";

const connectDB = async () => {
    try {
        // Set mongoose options for better connection handling
        mongoose.set('strictQuery', false);

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });

        console.log(`\n✅ MongoDB connected successfully!`);
        console.log(`🔗 DB HOST: ${connectionInstance.connection.host}`);
        console.log(`📊 Database: ${connectionInstance.connection.name}`);

    } catch (error) {
        console.log("\n❌ Database connection failed!");
        console.log("🔍 Error details:", error.message);

        if (error.message.includes('IP')) {
            console.log("\n🛠️  SOLUTION:");
            console.log("1. Go to MongoDB Atlas → Network Access");
            console.log("2. Add your current IP address to whitelist");
            console.log("3. Or add 0.0.0.0/0 for all IPs (development only)");
        }

        if (error.message.includes('authentication')) {
            console.log("\n🛠️  SOLUTION:");
            console.log("1. Check username/password in connection string");
            console.log("2. Verify database user permissions");
        }

        // Don't exit process in development, just log the error
        console.log("⚠️  Server will continue without database connection");
        console.log("🔄 Fix the database issue and restart the server");
    }
}

export default connectDB