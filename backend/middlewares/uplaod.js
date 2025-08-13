import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Function to upload already-saved files to Cloudinary manually
export const uploadToCloudinary = async (files) => {
    if (!files || files.length === 0) return [];

    const uploads = files.map((file) =>
        cloudinary.uploader.upload(file.path, {
            resource_type: "image",
            folder: "products",
        })
    );

    const results = await Promise.all(uploads);

    return results.map((res) => ({
        public_id: res.public_id,
        url: res.secure_url,
    }));
};

// Multer storage directly to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "shopify-clone/product",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

const upload = multer({ storage });

export default upload;
