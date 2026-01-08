import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 8000,
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET_CAPTCHA_KEY: process.env.SECRET_CAPTCHA_KEY
}


export default config;