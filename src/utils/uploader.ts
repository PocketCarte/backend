import multer from "multer";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { firebaseStorage } from "../../firebase";

export const upload = multer({ storage: multer.memoryStorage() });

export const uploadFile = async (path: string, file: any, filename: string) => {
  const extension = file.originalname.split(".")[1]
    ? file.originalname.split(".")[1]
    : "png";
  const storageRef = ref(firebaseStorage, `${path}/${filename}.${extension}`);

  const resultUpload = await uploadBytes(storageRef, file.buffer);
  const link = await getDownloadURL(storageRef);

  return {
    path: resultUpload.metadata.fullPath,
    link,
  };
};

export const deleteFile = (path: string) => {
  const storageRef = ref(firebaseStorage, `${path}`);

  return deleteObject(storageRef);
};
