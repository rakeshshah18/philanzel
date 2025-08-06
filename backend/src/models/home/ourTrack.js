import mongoose from "mongoose";

const ourTrackSchema = new mongoose.Schema({
    yearExp: { 
        type: Number, 
        required: [true, 'Years of experience is required'],
        min: [0, 'Years of experience cannot be negative']
    },
    totalExpert: { 
        type: Number, 
        required: [true, 'Total experts count is required'],
        min: [0, 'Total experts cannot be negative']
    },
    planningDone: { 
        type: Number, 
        required: [true, 'Planning done count is required'],
        min: [0, 'Planning done cannot be negative']
    },
    happyCustomers: { 
        type: Number, 
        required: [true, 'Happy customers count is required'],
        min: [0, 'Happy customers cannot be negative']
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'ourtracks' // Explicit collection name
});

// Add a method to format the data
ourTrackSchema.methods.toFormattedJSON = function() {
    return {
        id: this._id,
        yearExp: this.yearExp,
        totalExpert: this.totalExpert,
        planningDone: this.planningDone,
        happyCustomers: this.happyCustomers,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

const OurTrack = mongoose.model("OurTrack", ourTrackSchema);

export default OurTrack;
