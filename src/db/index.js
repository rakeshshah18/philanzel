import mongoose from "mongoose";
import { DB_NAME } from "../utils/constant.js";
import config from "../config/config.js";

const connectDB = async () => {
    try {
        // Set mongoose options for better connection handling
        mongoose.set('strictQuery', false);

        const connectionInstance = await mongoose.connect(`${config.MONGODB_URI}/${DB_NAME}`, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10s for server selection
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            connectTimeoutMS: 10000, // Give up initial connection after 10s
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain a minimum of 5 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
        });

        console.log(`\n✅ MongoDB connected successfully!`);
        console.log(`🔗 DB HOST: ${connectionInstance.connection.host}`);
        console.log(`📊 Database: ${connectionInstance.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

    } catch (error) {
        console.log("\n❌ Database connection failed!");
        console.log("🔍 Error details:", error.message);

        // Handle specific connection errors
        if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            console.log("\n🛠️  SOLUTION:");
            console.log("1. Check your internet connection");
            console.log("2. Verify the MongoDB Atlas cluster URL");
            console.log("3. Ensure DNS resolution is working");
        } else if (error.message.includes('IP')) {
            console.log("\n🛠️  SOLUTION:");
            console.log("1. Go to MongoDB Atlas → Network Access");
            console.log("2. Add your current IP address to whitelist");
            console.log("3. Or add 0.0.0.0/0 for all IPs (development only)");
        } else if (error.message.includes('authentication')) {
            console.log("\n🛠️  SOLUTION:");
            console.log("1. Check username/password in connection string");
            console.log("2. Verify database user permissions");
        } else if (error.message.includes('timeout')) {
            console.log("\n🛠️  SOLUTION:");
            console.log("1. Check your internet connection stability");
            console.log("2. Try connecting from a different network");
            console.log("3. Contact MongoDB Atlas support if issue persists");
        }

        // Don't exit process in development, just log the error
        console.log("⚠️  Server will continue without database connection");
        console.log("🔄 Fix the database issue and restart the server");

        // Throw error to prevent app from starting with invalid DB connection
        throw error;
    }
}

export default connectDB