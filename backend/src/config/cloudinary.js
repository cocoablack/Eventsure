import { createHash } from "node:crypto";
import AppError from "../utils/AppError.js";

export const hasCloudinaryConfig = () => Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

export const uploadPrivateDocument = async (file, folder) => {
  if (!hasCloudinaryConfig()) throw new AppError("Cloudinary is not configured for secure document uploads", 503);
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureSource = `folder=${folder}&timestamp=${timestamp}&type=authenticated${process.env.CLOUDINARY_API_SECRET}`;
  const signature = createHash("sha1").update(signatureSource).digest("hex");
  const form = new FormData();
  form.append("file", new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  form.append("api_key", process.env.CLOUDINARY_API_KEY);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("type", "authenticated");
  form.append("signature", signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: "POST", body: form });
  const data = await response.json();
  if (!response.ok) throw new AppError(data.error?.message || "Document upload failed", 502);
  return { url: data.secure_url, publicId: data.public_id, resourceType: data.resource_type };
};
