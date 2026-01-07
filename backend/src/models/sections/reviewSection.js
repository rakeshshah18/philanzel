import mongoose from "mongoose";

const reviewSectionSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, 'Heading is required'],
        trim: true,
        maxlength: [100, 'Heading cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    reviewProvider: {
        type: String,
        required: [true, 'Review provider is required'],
        trim: true,
        enum: ['Google', 'Facebook', 'Trustpilot', 'Yelp', 'Custom'],
        default: 'Google'
    },

    averageRating: {
        type: Number,
        required: [true, 'Average rating is required'],
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5'],
        default: 0
    },
    totalReviewCount: {
        type: Number,
        required: [true, 'Total review count is required'],
        min: [0, 'Review count cannot be negative'],
        default: 0
    },

    writeReviewButton: {
        text: {
            type: String,
            default: 'Write Review',
            trim: true,
            maxlength: [50, 'Button text cannot exceed 50 characters']
        },
        url: {
            type: String,
            required: [true, 'Write review URL is required'],
            trim: true
        },
        isEnabled: {
            type: Boolean,
            default: true
        }
    },

    reviews: [{
        userName: {
            type: String,
            required: [true, 'User name is required'],
            trim: true,
            maxlength: [100, 'User name cannot exceed 100 characters']
        },
        userProfilePhoto: {
            type: String,
            trim: true,
            default: null
        },
        reviewProviderLogo: {
            type: String,
            required: [true, 'Review provider logo is required'],
            trim: true
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot be more than 5']
        },
        reviewText: {
            type: String,
            required: [true, 'Review text is required'],
            trim: true,
            minlength: [10, 'Review must be at least 10 characters long'],
            maxlength: [1000, 'Review cannot exceed 1000 characters']
        },
        reviewDate: {
            type: Date,
            default: Date.now
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isVisible: {
            type: Boolean,
            default: true
        }
    }],

    isActive: {
        type: Boolean,
        default: true
    },
    displayOrder: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

reviewSectionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    if (this.reviews && this.reviews.length > 0) {
        const visibleReviews = this.reviews.filter(review => review.isVisible);

        if (visibleReviews.length > 0) {
            const totalStars = visibleReviews.reduce((sum, review) => sum + review.rating, 0);
            const average = totalStars / visibleReviews.length;
            this.averageRating = Math.round(average * 10) / 10;
            this.totalReviewCount = visibleReviews.length;

            console.log(`Rating calculation: Total stars: ${totalStars}, Total reviews: ${visibleReviews.length}, Average: ${this.averageRating}`);
        } else {
            this.averageRating = 0;
            this.totalReviewCount = 0;
        }
    } else {
        this.averageRating = 0;
        this.totalReviewCount = 0;
    }

    next();
});

reviewSectionSchema.methods.addReview = function (reviewData) {
    this.reviews.push(reviewData);
    return this.save();
};

reviewSectionSchema.methods.getVisibleReviews = function () {
    return this.reviews.filter(review => review.isVisible);
};

reviewSectionSchema.statics.getActiveReviewSections = function () {
    return this.find({ isActive: true }).sort({ displayOrder: 1 });
};

const ReviewSection = mongoose.model("ReviewSection", reviewSectionSchema);

export default ReviewSection;
