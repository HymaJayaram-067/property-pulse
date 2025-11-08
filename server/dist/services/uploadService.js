"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadMultipleToCloudinary = exports.uploadToCloudinary = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../config/cloudinary");
// Configure multer for memory storage
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
// Upload single image to Cloudinary
const uploadToCloudinary = async (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({
            folder: 'property-pulse',
            public_id: `${Date.now()}-${fileName}`,
            transformation: [
                { width: 1200, height: 800, crop: 'limit' },
                { quality: 'auto' },
            ],
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result.secure_url);
            }
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
// Upload multiple images
const uploadMultipleToCloudinary = async (files) => {
    const uploadPromises = files.map((file) => (0, exports.uploadToCloudinary)(file.buffer, file.originalname));
    return Promise.all(uploadPromises);
};
exports.uploadMultipleToCloudinary = uploadMultipleToCloudinary;
// Delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
    try {
        // Extract public ID from URL
        const urlParts = imageUrl.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `property-pulse/${publicIdWithExt.split('.')[0]}`;
        await cloudinary_1.cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        // Don't throw error as this is cleanup
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
//# sourceMappingURL=uploadService.js.map