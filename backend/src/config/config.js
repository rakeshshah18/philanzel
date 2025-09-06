import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 8000, // Changed to 8000
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://rakesh:rakesh1234@cluster0.gbslvkk.mongodb.net",
    SECRET_CAPTCHA_KEY: process.env.SECRET_CAPTCHA_KEY || "secretCaptchaKey123"
}


export default config;