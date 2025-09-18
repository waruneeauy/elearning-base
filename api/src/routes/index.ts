import { Router } from "express";
import { readdirSync } from "fs";
import { join } from "path";
import { authenticateJWT } from "../middlewares/auth";
import { login } from "../controllers/login.controller";
import { completed } from "../controllers/customerUser.controller";
import { putDateExp } from "../controllers/user.controller";

const router: any = Router();

const controllersDir = join(__dirname, "../controllers");

// Map method names to HTTP verbs
const methodMap: any = {
  createDataById: "post",
  getDataAll: "get",
  getDataLists: "get",
  getDataAllSub: "get",
  getDataById: "get",
  createData: "post",
  updateData: "put",
  changeData: "patch",
  deleteData: "delete",
};

router.post("/login", login);
router.post("/customer-user/completed", authenticateJWT, completed);

const generateRoutes = () => {
  readdirSync(controllersDir).forEach((file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const controller = require(join(controllersDir, file));
      const routeName = file.split(
        file.endsWith(".js") ? ".controller.js" : ".controller.ts"
      )[0]; // e.g., 'userController' becomes 'user'

      Object.keys(controller).forEach((key) => {
        let method = methodMap[key] || "get"; // default to GET if not mapped
        let path = `/${convertToKebabCase(routeName)}`;

        if (
          key === "createDataById" ||
          key === "getDataById" ||
          key === "changeData" ||
          key === "updateData" ||
          key === "deleteData"
        ) {
          path += "/:id";
        } else if (key === "getDataAllSub") {
          path += "/list/:sid";
        } else if (key === "getDataLists") {
          path += "/lists";
        } else if (key === "getByOrgIdAndSetNo") {
          path += "/:customerId/:courseId";
        } else if (key === "getCurriculumById") {
          path += "/curriculum/:courseId";
        } else if (!methodMap[key]) {
          const actionVal = convertToKebabCase(key);
          const actionValSplit = actionVal.split("-");

          if (actionValSplit.length > 1) {
            method = actionValSplit[0] || "get";
            for (let index = 1; index < actionValSplit.length; index++) {
              path += `/${actionValSplit[index]}`;
            }

            if (method === "put" || method === "delete") {
              path += "/:id";
            }
          }
        }

        // console.log(`Adding route: ${method.toUpperCase()} ${path}`);

        router[method](path, authenticateJWT, controller[key]);
      });
    }
  });
};

function convertToKebabCase(str: string) {
  return str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
}

generateRoutes();

export default router;
