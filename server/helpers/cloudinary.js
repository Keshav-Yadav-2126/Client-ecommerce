import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configure Cloudinary (latest v2 API)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function handleUploadImage(file) {
  // file is a data URI string (from controller)
  const result = await cloudinary.uploader.upload(file, {
    resource_type: 'image',
  });
  return result;
}

export { handleUploadImage, upload };