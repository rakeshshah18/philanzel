import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 9000, // Changed to 9000
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://rakesh:rakesh1234@cluster0.gbslvkk.mongodb.net",
    SECRET_CAPTCHA_KEY: process.env.SECRET_CAPTCHA_KEY || "secretCaptchaKey123"
}

console.log('🔧 Config loaded - PORT:', config.PORT);

export default config;