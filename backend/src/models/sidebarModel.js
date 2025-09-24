import mongoose from 'mongoose';

// Schema for dropdown items
const DropdownItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    route: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: true });

// Main sidebar item schema
const SidebarItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['single', 'dropdown'],
        default: 'single'
    },
    // For single page type
    route: {
        type: String,
        required: function() {
            return this.type === 'single';
        },
        trim: true
    },
    // For dropdown type
    dropdownItems: [{
        type: DropdownItemSchema,
        required: function() {
            return this.type === 'dropdown';
        }
    }],
    // Display order
    order: {
        type: Number,
        default: 0
    },
    // Active status
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for ordering
SidebarItemSchema.index({ order: 1, isActive: 1 });

const SidebarItem = mongoose.model('SidebarItem', SidebarItemSchema);

export default SidebarItem;
