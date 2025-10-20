import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configure Cloudinary (latest v2 API)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
});

async function handleUploadImage(file) {
  // file is a data URI string (from controller)
  const result = await cloudinary.uploader.upload(file, {
    resource_type: 'image',
  });
  return result;
}

async function handleUploadVideo(file) {
  // file is a data URI string (from controller)
  const result = await cloudinary.uploader.upload(file, {
    resource_type: 'video',
  });
  return result;
}

export { handleUploadImage, handleUploadVideo, upload };
