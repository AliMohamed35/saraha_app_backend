import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

// Single file upload
export async function uploadFile({ path, options }) {
  return await cloudinary.uploader.upload(path, options);
}

// Multiple files upload
export async function uploadFiles(files, options) {
  console.log("FILES RECEIVED:", files); // 👈 Add this
  const attachments = [];

  for (const file of files) {
    try {
      const { secure_url, public_id } = await uploadFile({
        path: file.path,
        options,
      });
      attachments.push({ secure_url, public_id });
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err; // rethrow to handle higher up
    }
  }

  return attachments;
}

export async function deleteFolder(path) {
  await cloudinary.api.delete_resources_by_prefix(path);
  await cloudinary.api.delete_folder(path);
}

export default cloudinary;
