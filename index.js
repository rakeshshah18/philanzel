import bodyParser from 'body-parser';
import express from 'express';
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "./src/career/documents")));

connectDB()

app.use('/api', routes);
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
    console.log(`📁 File uploads accessible at: http://localhost:${config.PORT}/uploads/`);
});