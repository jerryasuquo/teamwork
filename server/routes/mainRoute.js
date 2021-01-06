import express from "express";
import bodyParse from "body-parser";
import swaggerUI from "swagger-ui-express";
import swaggerDoc from "../../app.json";
import { NOT_FOUND } from "../helpers/statusCode";
import postRoute from "./postRoute";
import userRoute from "./userRoute";
import isContentTypeValid from "../middleware/isContentTypeValid";
import isValidJSON from "../middleware/isValidJSON";

const router = express.Router();

router.use(bodyParse.json());
router.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
router.use("/api/v2", isValidJSON, postRoute);
router.use("/api/v2/auth", isContentTypeValid, userRoute);

router.use("/", (request, response) => {
  response.status(NOT_FOUND).send({
    status: NOT_FOUND,
    message: "Hello, and welcome to Teamwork API!",
  });
});

export default router;
