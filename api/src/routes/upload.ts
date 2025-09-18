import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import HttpSuccess from "../config/httpSuccess";
import { NotFoundError } from "../errors/CustomError";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder for uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now(); // + "-" + Math.round(Math.random() * 1e9)
    const fileAudio = /mp3/;
    const fileVideo = /mp4/;
    const type = fileAudio.test(path.extname(file.originalname).toLowerCase())
      ? "audio"
      : fileVideo.test(file.mimetype)
        ? "video"
        : "image";
    cb(null, `${type}-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|mp3|mp4/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error(`Only images audio and videos are allowed!`));
    }
  },
});

router.post("/", authenticateJWT, upload.single("file"), async (req: any, res: Response) => {
  if (!req.file) {
    throw new NotFoundError("No file uploaded.");
  }

  res.send(
    new HttpSuccess({
      message: "File uploaded successfully",
      file: req.file.filename,
    }),
  );
});

export default router;
