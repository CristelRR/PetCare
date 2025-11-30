import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

// Tipo de params para Cloudinary
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

// ====================== CLOUDINARY PARA POSTS (COMUNIDAD) ======================
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: async (): Promise<CloudinaryParams> => ({
    folder: "petcare/community",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png"],
  }),
});

// Middleware final
export const uploadPet = multer({ storage: petStorage });
export const uploadPost = multer({ storage: postStorage });
