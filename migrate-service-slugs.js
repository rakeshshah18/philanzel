const mongoose = require('mongoose');
const OurServices = require('./src/models/service.js');

async function migrateSlugs() {
    await mongoose.connect('mongodb://localhost:27017/philanzel'); // Update DB name if needed
    const services = await OurServices.find();
    for (const service of services) {
        if (!service.slug) {
            service.slug = service.name.replace(/\s+/g, '-').toLowerCase();
            await service.save();
            console.log(`Updated: ${service.name} -> ${service.slug}`);
        }
    }
    console.log('Slug migration complete.');
    await mongoose.disconnect();
}

migrateSlugs();