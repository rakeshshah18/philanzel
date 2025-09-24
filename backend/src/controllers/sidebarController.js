import SidebarItem from '../models/sidebarModel.js';

// Get all sidebar items
const getAllSidebarItems = async (req, res) => {
    try {
        const sidebarItems = await SidebarItem.find({ isActive: true })
            .sort({ order: 1 })
            .lean();
        
        res.status(200).json({
            success: true,
            data: sidebarItems
        });
    } catch (error) {
        console.error('❌ Error fetching sidebar items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sidebar items',
            error: error.message
        });
    }
};

// Get single sidebar item by ID
const getSidebarItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const sidebarItem = await SidebarItem.findById(id);
        
        if (!sidebarItem) {
            return res.status(404).json({
                success: false,
                message: 'Sidebar item not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: sidebarItem
        });
    } catch (error) {
        console.error('Error fetching sidebar item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sidebar item',
            error: error.message
        });
    }
};

// Create new sidebar item
const createSidebarItem = async (req, res) => {
    try {
        const { name, type, route, dropdownItems, order } = req.body;
        
        // Validation
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: 'Name and type are required'
            });
        }
        
        if (type === 'single' && !route) {
            return res.status(400).json({
                success: false,
                message: 'Route is required for single page type'
            });
        }
        
        if (type === 'dropdown' && (!dropdownItems || dropdownItems.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Dropdown items are required for dropdown type'
            });
        }
        
        const newSidebarItem = new SidebarItem({
            name,
            type,
            route: type === 'single' ? route : undefined,
            dropdownItems: type === 'dropdown' ? dropdownItems : undefined,
            order: order || 0
        });
        
        const savedItem = await newSidebarItem.save();
        
        res.status(201).json({
            success: true,
            message: 'Sidebar item created successfully',
            data: savedItem
        });
    } catch (error) {
        console.error('Error creating sidebar item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create sidebar item',
            error: error.message
        });
    }
};

// Update sidebar item
const updateSidebarItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, route, dropdownItems, order, isActive } = req.body;
        
        const sidebarItem = await SidebarItem.findById(id);
        if (!sidebarItem) {
            return res.status(404).json({
                success: false,
                message: 'Sidebar item not found'
            });
        }
        
        // Validation
        if (type === 'single' && !route) {
            return res.status(400).json({
                success: false,
                message: 'Route is required for single page type'
            });
        }
        
        if (type === 'dropdown' && (!dropdownItems || dropdownItems.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Dropdown items are required for dropdown type'
            });
        }
        
        // Update fields
        sidebarItem.name = name || sidebarItem.name;
        sidebarItem.type = type || sidebarItem.type;
        sidebarItem.route = type === 'single' ? route : undefined;
        sidebarItem.dropdownItems = type === 'dropdown' ? dropdownItems : undefined;
        sidebarItem.order = order !== undefined ? order : sidebarItem.order;
        sidebarItem.isActive = isActive !== undefined ? isActive : sidebarItem.isActive;
        
        const updatedItem = await sidebarItem.save();
        
        res.status(200).json({
            success: true,
            message: 'Sidebar item updated successfully',
            data: updatedItem
        });
    } catch (error) {
        console.error('Error updating sidebar item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update sidebar item',
            error: error.message
        });
    }
};

// Delete sidebar item
const deleteSidebarItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        const sidebarItem = await SidebarItem.findById(id);
        if (!sidebarItem) {
            return res.status(404).json({
                success: false,
                message: 'Sidebar item not found'
            });
        }
        
        await SidebarItem.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Sidebar item deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting sidebar item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete sidebar item',
            error: error.message
        });
    }
};

// Reorder sidebar items
const reorderSidebarItems = async (req, res) => {
    try {
        const { items } = req.body; // Array of { id, order }
        
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({
                success: false,
                message: 'Items array is required'
            });
        }
        
        // Update order for each item
        const updatePromises = items.map(item => 
            SidebarItem.findByIdAndUpdate(
                item.id,
                { order: item.order },
                { new: true }
            )
        );
        
        await Promise.all(updatePromises);
        
        // Get updated items
        const updatedItems = await SidebarItem.find({ isActive: true })
            .sort({ order: 1 })
            .lean();
        
        res.status(200).json({
            success: true,
            message: 'Sidebar items reordered successfully',
            data: updatedItems
        });
    } catch (error) {
        console.error('Error reordering sidebar items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reorder sidebar items',
            error: error.message
        });
    }
};

export {
    getAllSidebarItems,
    getSidebarItemById,
    createSidebarItem,
    updateSidebarItem,
    deleteSidebarItem,
    reorderSidebarItems
};
