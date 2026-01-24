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


const allowedOrigins = config.CORS_ORIGIN ? config.CORS_ORIGIN.split(',') : [];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow server-to-server

        const allowedOrigins = config.CORS_ORIGIN
            ? config.CORS_ORIGIN.split(',').map(o => o.trim())
            : ['http://localhost:3000', 'https://philanzelpublic-hoedppxqs-rakeshs-projects-e83a0367.vercel.app'];

        if (allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            if (process.env.NODE_ENV === 'production') {
                callback(null, false);
            } else {
                callback(null, true);
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const allowedOrigins = config.CORS_ORIGIN
            ? config.CORS_ORIGIN.split(',').map(o => o.trim())
            : [
                'http://localhost:3000',
                'https://philanzelpublic-hoedppxqs-rakeshs-projects-e83a0367.vercel.app'
              ];

        if (allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
}));



app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});


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