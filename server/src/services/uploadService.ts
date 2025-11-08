import multer from 'multer';
import { cloudinary } from '../config/cloudinary';
import { Request } from 'express';

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Upload single image to Cloudinary
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'property-pulse',
        public_id: `${Date.now()}-${fileName}`,
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Upload multiple images
export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[]
): Promise<string[]> => {
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, file.originalname)
  );
  return Promise.all(uploadPromises);
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public ID from URL
    const urlParts = imageUrl.split('/');
    const publicIdWithExt = urlParts[urlParts.length - 1];
    const publicId = `property-pulse/${publicIdWithExt.split('.')[0]}`;
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    // Don't throw error as this is cleanup
  }
};
