import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";
import path from "path";
import fs from "fs";

// Solo para las mascotas en Cloudinary
type CloudinaryParams = {
  folder: string;
  resource_type?: string;
  allowed_formats?: string[];
};

// ====================== CLOUDINARY PARA MASCOTAS ======================
const petStorage = new CloudinaryStorage({
  cloudinary,
  params: async (): Promise<CloudinaryParams> => ({
    folder: "petcare/pets",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png"],
  }),
});

// ====================== DISCO LOCAL PARA POSTS ========================
const communityUploadsPath = path.join(__dirname, "../../uploads/community");
fs.mkdirSync(communityUploadsPath, { recursive: true });

const postDiskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, communityUploadsPath);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

export const uploadPet = multer({ storage: petStorage });
export const uploadPost = multer({ storage: postDiskStorage });
