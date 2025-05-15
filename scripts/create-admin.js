const mongoose = require('mongoose');
const Admin = require('../models/Admin');

mongoose.connect('mongodb://127.0.0.1:27017/wildlife')
  .then(async () => {
    const admin = new Admin({
      email: 'admin@example.com',
      password: 'admin123' // will be hashed
    });
    await admin.save();
    console.log('✅ Admin user created');
    mongoose.disconnect();
  })
  .catch(err => console.log('❌ Error:', err));
