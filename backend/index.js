// "use client"
// import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './src/routes/index.js'
process.env.DOTENV_CONFIG_SILENT = 'true';
import dotenv from 'dotenv'
import path from "path";
import { fileURLToPath } from 'url';
import connectDB from './src/db/index.js';
import config from './src/config/config.js';
// dotenv.config({ quiet: true })

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

const app = express();

// Ensure upload directories exist so Multer can write files.
import fs from 'fs';
const ensureUploadDirs = () => {
    try {
        const dirs = [
            path.join(process.cwd(), 'uploads'),
            path.join(process.cwd(), 'uploads', 'events'),
            path.join(__dirname, 'src', 'uploads', 'images'),
            path.join(process.cwd(), 'uploads', 'empowering-individuals'),
        ];
        dirs.forEach(d => {
            if (!fs.existsSync(d)) {
                fs.mkdirSync(d, { recursive: true });
                console.log('Created upload dir:', d);
            }
        });
    } catch (e) {
        console.error('Failed to ensure upload directories:', e);
    }
};
ensureUploadDirs();


const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'https://testingphilanzelservices.com',
    'https://www.testingphilanzelservices.com',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use('/uploads/events', express.static(path.join(process.cwd(), 'uploads/events')));
app.use("/uploads", express.static(path.join(__dirname, "./src/career/documents")));
app.use("/uploads/images", express.static(path.join(__dirname, "./src/uploads/images")));
app.use("/uploads/empowering-individuals", express.static(path.join(__dirname, "./uploads/empowering-individuals")));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get(/^((?!api).)*$/, (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running', timestamp: new Date() });
});

app.use('/api', routes);

// Simple error handler to log errors and return JSON responses for API endpoints
// This helps surface Multer/route errors as JSON instead of generic HTML pages.
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err && (err.stack || err));
    if (req.path && req.path.startsWith('/api')) {
        const message = err?.message || 'Internal server error';
        return res.status(500).json({ success: false, message });
    }
    // Fallback: let default handler handle non-API routes
    next(err);
});

import { seedSuperAdmin } from './src/adminAuth/models/Admin.js';
import { seedSidebarItems } from './src/utils/seedSidebar.js';

connectDB().then(async () => {
    await seedSuperAdmin();
    await seedSidebarItems();
});
const PORT = process.env.PORT || config.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server bound to: 127.0.0.1:${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.on('listening', () => {
    console.log('Server is listening and ready to accept connections');
});