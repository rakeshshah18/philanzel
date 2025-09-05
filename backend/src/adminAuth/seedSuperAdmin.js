import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin, { seedSuperAdmin } from './models/Admin.js';
import config from '../config/config.js';

dotenv.config();

(async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await seedSuperAdmin();
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding super_admin:', err);
    process.exit(1);
  }
})();
