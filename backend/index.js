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
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use express built-in parsers instead of bodyParser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Debug middleware to log request details
app.use((req, res, next) => {
    if (req.method === 'POST' && req.url.includes('/auth/login')) {
        console.log('🔍 Raw request debugging:');
        console.log('  - Content-Type:', req.headers['content-type']);
        console.log('  - Body before parsing:', req.body);
        console.log('  - Raw body keys:', Object.keys(req.body || {}));
    }
    next();
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "./src/career/documents")));
app.use("/uploads/images", express.static(path.join(__dirname, "./src/uploads/images")));
app.use("/uploads/empowering-individuals", express.static(path.join(__dirname, "./uploads/empowering-individuals")));

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
}

// Add health check endpoint BEFORE API routes
app.get('/health', (req, res) => {
    console.log('🏥 Health check requested');
    res.json({ status: 'OK', message: 'Server is running', timestamp: new Date() });
});

// Add API routes
app.use('/api', routes);

// Connect to MongoDB
connectDB();

// More explicit server binding
const server = app.listen(config.PORT, '127.0.0.1', () => {
    console.log(`Server is running on port ${config.PORT}`);
    console.log(`🌐 Server accessible at: http://localhost:${config.PORT}`);
    console.log(`🏥 Health check: http://localhost:${config.PORT}/health`);
    console.log(`📁 File uploads accessible at: http://localhost:${config.PORT}/uploads/`);
    console.log(`📍 Server bound to: 127.0.0.1:${config.PORT}`);
});

server.on('error', (err) => {
    console.error('❌ Server error:', err);
});

server.on('listening', () => {
    console.log('✅ Server is listening and ready to accept connections');
});