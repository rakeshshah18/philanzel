import mongoose from "mongoose";
import { DB_NAME } from "../utils/constant.js";
import config from "../config/config.js";

const connectDB = async () => {
    try {
        // Set mongoose options for better connection handling
        mongoose.set('strictQuery', false);

        const connectionInstance = await mongoose.connect(`${config.MONGODB_URI}/${DB_NAME}`, {
            serverSelectionTimeoutMS: 15000, // Timeout after 15s for server selection
            socketTimeoutMS: 60000, // Close sockets after 60s of inactivity
            connectTimeoutMS: 15000, // Give up initial connection after 15s
            maxPoolSize: 5, // Reduce max pool size to 5 connections
            minPoolSize: 2, // Reduce minimum pool size to 2 connections
            maxIdleTimeMS: 60000, // Increase idle time to 60s
            heartbeatFrequencyMS: 30000, // Send heartbeat every 30s
            retryWrites: true, // Enable retryable writes
            retryReads: true, // Enable retryable reads
        });

        console.log(`\n✅ MongoDB connected successfully!`);
        console.log(`🔗 DB HOST: ${connectionInstance.connection.host}`);
        console.log(`📊 Database: ${connectionInstance.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

        mongoose.connection.on('connecting', () => {
            console.log('🔄 MongoDB connecting...');
        });

        mongoose.connection.on('close', () => {
            console.log('🔒 MongoDB connection closed');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
            await mongoose.connection.close();
            console.log('✅ MongoDB connection closed through app termination');
            process.exit(0);
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