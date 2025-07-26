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
    lastLogin: {
        type: Date
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

// Index for email
adminSchema.index({ email: 1 });

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
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            name: this.name,
            role: this.role
        },
        process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
        }
    );
};

// Generate refresh token
adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id
        },
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
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

export default mongoose.model('Admin', adminSchema);
