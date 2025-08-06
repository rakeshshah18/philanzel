import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'News title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'News content is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Architecture', 'Interior Design', 'Exterior Design', 'Construction', 'Technology', 'General'],
            message: 'Invalid category'
        },
        default: 'General'
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: {
            values: ['Active', 'Inactive', 'Draft'],
            message: 'Invalid status'
        },
        default: 'Draft'
    },
    thumbnail: {
        originalName: {
            type: String
        },
        filename: {
            type: String
        },
        path: {
            type: String
        },
        size: {
            type: Number
        },
        mimetype: {
            type: String
        },
        url: {
            type: String
        },
        altText: {
            type: String,
            required: [true, 'Alt text is required for accessibility']
        }
    },
    author: {
        type: String,
        default: 'Admin'
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    tags: [{
        type: String,
        trim: true
    }],
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    views: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Pre-save middleware to generate slug from title
newsSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .trim();

        // Add timestamp to ensure uniqueness
        if (this.isNew) {
            this.slug += '-' + Date.now();
        }
    }
    next();
});

// Virtual for formatted publish date
newsSchema.virtual('formattedDate').get(function () {
    return this.publishDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Ensure virtual fields are serialized
newsSchema.set('toJSON', { virtuals: true });

export default mongoose.model('News', newsSchema);
