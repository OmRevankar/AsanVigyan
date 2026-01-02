import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {

    try {

        const uploadResponse = await cloudinary.uploader.upload(localFilePath);
    
        if(!uploadResponse)
            console.log("Cloudinary upload Failed");
    
        fs.unlinkSync(localFilePath);
        console.log("Cloudinary upload Successfull");

        return uploadResponse;

    } catch (error) {

        fs.unlinkSync(localFilePath)
        console.log("Failed to upload file on cloudinary :",error);
        return null;

    }

}

const deleteFromCloudinary = async (cloudinaryFilePath) => {

    try {
        
        const deleteResponse = await cloudinary.uploader.destroy(cloudinaryFilePath);

        if(!deleteResponse)
            console.log("File Deletion Failed")

        console.log("File Deleted successfully from cloudinary");

    } catch (error) {
        console.log("File Deletion Failed :",error);
    }

}

export {uploadOnCloudinary,deleteFromCloudinary}