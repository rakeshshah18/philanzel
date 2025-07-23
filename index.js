import bodyParser from 'body-parser';
import express from 'express';
import routes from './src/routes/index.js'
import dotenv from 'dotenv'
import connectDB from './src/db/index.js';
import config from './src/config/config.js';

dotenv.config()

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDB()

app.use('/api', routes);
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});