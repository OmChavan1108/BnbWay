// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 🔐 Configure your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY ,
  api_secret: process.env.CLOUD_API_SECERT
});

// 🗂 Setup storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'AirbnbApp', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

module.exports = {
  cloudinary,
  storage
};
