const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Check whether Cloudinary credentials are fully configured.
 */
const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Create a CloudinaryStorage instance for multer.
 * @param {string} folder  – Cloudinary folder to upload into (e.g. 'resqtail/reports')
 * @returns {CloudinaryStorage}
 */
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
    },
  });
};

module.exports = { cloudinary, isCloudinaryConfigured, createCloudinaryStorage };
