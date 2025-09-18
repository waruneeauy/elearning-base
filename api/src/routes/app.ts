import { Router } from "express";
import { readdirSync } from "fs";
import { join } from "path";
import { authenticateJWTUser } from "../middlewares/auth";
import {
  signin,
  signup,
  profile,
  updateProfile,
  postSubmitCode,
  putChangePassword,
  updatePhoto,
} from "../controllers/app/account.controller";

// import multer from "multer";
// import path from "path";
// import HttpSuccess from "../config/httpSuccess";
// import { NotFoundError } from "../errors/CustomError";
// import { FileRequest } from "../interfaces/request.interface";
import {
  getCourseDataById,
  getCourseLists,
  getMyCourseLists,
  getRank,
  putViewVideo,
} from "../controllers/app/course.controller";
import {
  curriculumList,
  getCurriculumById,
  getMyCurriculumProcess,
  getScore,
  myCurriculumList,
  myCurriculumStatus,
  postCurriculumComplete,
} from "../controllers/app/curriculum.controller";
import { getQuiz, postQuiz, postQuizGroup } from "../controllers/app/quiz.controller";

const router: any = Router();

const controllersDir = join(__dirname, "../controllers/app");

// Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "learners/"); // Destination folder for uploads
//   },
//   filename: (req: FileRequest, file, cb) => {
//     const uniqueSuffix = Date.now(); // + "-" + Math.round(Math.random() * 1e9)
//     cb(null, `${req.query.id}-${uniqueSuffix}-${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

//     if (extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error(`Only images are allowed!`));
//     }
//   },
// });

// router.post(
//   "/upload-image",
//   authenticateJWTUser,
//   upload.single("file"),
//   async (req: any, res: Response) => {
//     if (!req.file) {
//       throw new NotFoundError("No file uploaded.");
//     }

//     res.send(
//       new HttpSuccess({
//         message: "File uploaded successfully",
//         file: req.file.filename,
//       }),
//     );
//   },
// );

// Map method names to HTTP verbs
const methodMap: any = {
  getLists: "get",
  getData: "get",
  getDataAllSub: "get",
  getDataById: "get",
  createData: "post",
  unlock: "post",
  redeem: "post",
  leave: "post",
  updateData: "put",
  changeData: "patch",
  deleteData: "delete",
};

router.post("/signin", signin);
router.post("/signup", signup);

router.get("/course", getCourseLists);
router.get("/course/curriculum", curriculumList);
router.get("/course/detail/:id", getCourseDataById);

router.get("/profile", authenticateJWTUser, profile);
router.put("/profile/change-password", authenticateJWTUser, putChangePassword);
router.put("/profile/photo", authenticateJWTUser, updatePhoto);
router.put("/profile", authenticateJWTUser, updateProfile);
router.get("/my-course", authenticateJWTUser, getMyCourseLists);
router.get("/my-rank", authenticateJWTUser, getRank);
router.get("/curriculum/:courseId", authenticateJWTUser, myCurriculumList);
router.get("/curriculum/status/:courseId", authenticateJWTUser, myCurriculumStatus);
router.get(
  "/curriculum/detail/:courseChildId/:learnerCodeId",
  authenticateJWTUser,
  getCurriculumById,
);
router.get("/curriculum/process/:learnerCodeId", authenticateJWTUser, getMyCurriculumProcess);
router.post("/submit-code", authenticateJWTUser, postSubmitCode);
router.post(
  "/curriculum/complete/:courseChildId/:learnerCodeId",
  authenticateJWTUser,
  postCurriculumComplete,
);

router.get("/quiz/:courseChildId/:learnerCodeId", authenticateJWTUser, getQuiz);
router.post("/quiz", authenticateJWTUser, postQuiz);
router.post("/quiz/group", authenticateJWTUser, postQuizGroup);
router.put("/course/start-video/:id", authenticateJWTUser, putViewVideo);

router.get("/curriculum/score/:courseChildId/:learnerCodeId", authenticateJWTUser, getScore);

const generateRoutes = () => {
  readdirSync(controllersDir).forEach((file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const controller = require(join(controllersDir, file));
      const routeName = file.split(file.endsWith(".js") ? ".controller.js" : ".controller.ts")[0]; // e.g., 'userController' becomes 'user'

      Object.keys(controller).forEach((key) => {
        let method = methodMap[key] || "get"; // default to GET if not mapped
        let path = `/${convertToKebabCase(routeName)}`;

        if (
          key === "getDataById" ||
          key === "changeData" ||
          key === "updateData" ||
          key === "deleteData"
        ) {
          path += "/:id";
        } else if (key === "getDataAllSub") {
          path += "/list/:sid";
        } else if (key === "unlock" || key === "redeem") {
          path += `/${key}`;
        }

        router[method](path, authenticateJWTUser, controller[key]);
      });
    }
  });
};

function convertToKebabCase(str: string) {
  return str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
}

generateRoutes();

export default router;
