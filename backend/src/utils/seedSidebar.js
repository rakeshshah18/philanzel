import SidebarItem from '../models/sidebarModel.js';

const sidebarData = [
    {
        name: 'Dashboard',
        type: 'single',
        route: '/dashboard',
        order: 0,
        isActive: true
    },
    {
        name: 'Home',
        type: 'single',
        route: '/home',
        order: 1,
        isActive: true
    },
    {
        name: 'About Us',
        type: 'single',
        route: '/about-us',
        order: 2,
        isActive: true
    },
    {
        name: 'Services',
        type: 'dropdown',
        dropdownItems: [
            { name: 'All Services', route: '/services' },
            { name: 'Service Management', route: '/services/manage' }
        ],
        order: 3,
        isActive: true
    },
    {
        name: 'Career',
        type: 'single',
        route: '/career',
        order: 4,
        isActive: true
    },
    {
        name: 'Partner',
        type: 'single',
        route: '/partner',
        order: 5,
        isActive: true
    },
    {
        name: 'Contact',
        type: 'single',
        route: '/contact',
        order: 6,
        isActive: true
    },
    {
        name: 'Sections',
        type: 'dropdown',
        dropdownItems: [
            { name: 'All Sections', route: '/sections' },
            { name: 'Reviews', route: '/sections/reviews' },
            { name: 'Advertisements', route: '/sections/ads' },
            { name: 'Footer', route: '/sections/footer' }
        ],
        order: 7,
        isActive: true
    }
];

const seedSidebarItems = async () => {
    try {
        const existingItems = await SidebarItem.find();

        if (existingItems.length > 0) {
            console.log('Sidebar items already exist, skipping seeding');
            return;
        }
        await SidebarItem.insertMany(sidebarData);
        console.log('Sidebar items seeded successfully');
    } catch (error) {
        console.error('Error seeding sidebar items:', error);
    }
};

export { seedSidebarItems };