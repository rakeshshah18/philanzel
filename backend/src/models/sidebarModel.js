import mongoose from 'mongoose';
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
    route: {
        type: String,
        required: function() {
            return this.type === 'single';
        },
        trim: true
    },
    dropdownItems: [{
        type: DropdownItemSchema,
        required: function() {
            return this.type === 'dropdown';
        }
    }],
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
SidebarItemSchema.index({ order: 1, isActive: 1 });
const SidebarItem = mongoose.model('SidebarItem', SidebarItemSchema);
export default SidebarItem;
