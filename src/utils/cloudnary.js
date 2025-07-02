import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadcloud = async (localpath) => {
    try {
        if (!localpath) return null;

        const result = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto"
        });

        console.log("File uploaded successfully:", result);
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    } finally {
        // Remove local file after upload attempt
        if (fs.existsSync(localpath)) {
            fs.unlinkSync(localpath);
        }
    }
};

export { uploadcloud };
