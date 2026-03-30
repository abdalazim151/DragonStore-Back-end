import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// 2. إعداد الـ Storage بتاع Multer ليرمي على Cloudinary مباشرة
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_profiles', // اسم الفولدر اللي هيتكريه في كلاوديناري
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage: storage });

export default upload;