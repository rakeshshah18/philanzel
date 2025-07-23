import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 8000,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://rakesh:rakesh1234@cluster0.gbslvkk.mongodb.net"
}

export default config;