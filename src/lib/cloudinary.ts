import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRETE as string,
});

const uploadOnCloudinary = async (localFile: string , type : string): Promise<string | null> => {
  try {
    if (!localFile) {
      return null;
    }

    const response: UploadApiResponse | UploadApiErrorResponse = await cloudinary.uploader.upload(localFile, {
        folder: type,  // Optional: specify a folder in Cloudinary
      });



    // Delete the local file after upload
    fs.unlinkSync(localFile);

    return response.url || null;
  } catch (err) {
    console.error('Error uploading file to Cloudinary:', err);

    // Make sure to delete the file even in case of an error
    if (fs.existsSync(localFile)) {
      fs.unlinkSync(localFile);
    }

    return null;
  }
};

export default uploadOnCloudinary;
