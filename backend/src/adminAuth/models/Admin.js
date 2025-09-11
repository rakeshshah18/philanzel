import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['admin', 'super_admin'],
        default: 'admin'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Allowed sidebar tabs for this admin (set by super_admin)
    allowedTabs: {
        type: [String],
        default: [], // empty array means no tabs allowed, undefined means all tabs allowed
    },
    lastLogin: {
        type: Date
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
adminSchema.methods.generateAccessToken = function () {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        throw new Error('JWT_ACCESS_SECRET environment variable is required');
    }

    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            name: this.name,
            role: this.role
        },
        secret,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
        }
    );
};

// Generate refresh token
adminSchema.methods.generateRefreshToken = function () {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET environment variable is required');
    }

    return jwt.sign(
        {
            id: this._id
        },
        secret,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d'
        }
    );
};

// Update last login
adminSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
    return this.save();
};

// Hide password in JSON output
adminSchema.methods.toJSON = function () {
    const admin = this.toObject();
    delete admin.password;
    delete admin.refreshToken;
    return admin;
};

const AdminModel = mongoose.model('Admin', adminSchema);

// Seed default super_admin if not exists
async function seedSuperAdmin() {
    const defaultEmail = '21amtics464@gmail.com';
    const defaultPassword = 'Rakesh@125';
    const defaultName = 'Super Admin';
    const existing = await AdminModel.findOne({ role: 'super_admin' });
    if (!existing) {
        const admin = new AdminModel({
            name: defaultName,
            email: defaultEmail,
            password: defaultPassword,
            role: 'super_admin',
            isActive: true
        });
        await admin.save();
        console.log('Default super_admin seeded.');
    }
}

export { AdminModel as default, seedSuperAdmin };
