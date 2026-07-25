import multer from "multer";
import AppError from "../utils/AppError.js";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const storage = multer.memoryStorage();

export const kycUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 4 },
  fileFilter(_req, file, callback) {
    if (!allowed.has(file.mimetype)) return callback(new AppError("KYC documents must be PDF, JPEG, PNG, or WebP", 400));
    callback(null, true);
  },
}).fields([
  { name: "governmentId", maxCount: 1 },
  { name: "cacCertificate", maxCount: 1 },
  { name: "faceOrLogo", maxCount: 1 },
  { name: "pastPortfolio", maxCount: 1 },
]);
