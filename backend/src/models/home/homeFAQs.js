import mongoose from "mongoose";

const homeFAQsSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, 'Heading is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    faqs: {
        type: [{
            question: {
                type: String,
                required: [true, 'Question is required for FAQ item'],
                trim: true,
                minlength: [3, 'Question must be at least 3 characters long'],
                maxlength: [200, 'Question cannot exceed 200 characters']
            },
            answer: {
                type: String,
                required: [true, 'Answer is required for FAQ item'],
            }
        }],
        validate: {
            validator: function (faqs) {
                return faqs && faqs.length > 0;
            },
            message: 'At least one FAQ (question and answer) is required'
        }
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

const HomeFAQs = mongoose.model("HomeFAQs", homeFAQsSchema);

export default HomeFAQs;
