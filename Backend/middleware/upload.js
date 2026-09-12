import multer from "multer";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    const error = new Error("Unsupported file type. Only JPEG, PNG, WEBP, GIF, and AVIF are allowed.");
    error.status = 400;
    cb(error);
    return;
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

// Express error handler that turns multer errors into clean 400s.
export function handleUploadErrors(err, _req, res, next) {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Maximum size is 8MB."
        : `Upload error: ${err.message}`;
    return res.status(400).json({ message });
  }
  return next(err);
}
