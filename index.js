import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './src/routes/index.js'
import dotenv from 'dotenv'
import path from "path";
import { fileURLToPath } from 'url';
import connectDB from './src/db/index.js';
import config from './src/config/config.js';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

const app = express();

// CORS configuration for React app
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "./src/career/documents")));
app.use("/uploads/images", express.static(path.join(__dirname, "./src/uploads/images")));

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
}

connectDB()

app.use('/api', routes);
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
    console.log(`📁 File uploads accessible at: http://localhost:${config.PORT}/uploads/`);
});