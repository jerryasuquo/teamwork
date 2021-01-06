import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Model from "../models/Model";
import responseHandler from "../helpers/responseHandler";
import { UNAUTHORIZED, BAD_REQUEST } from "../helpers/statusCode";

dotenv.config();

const userModel = new Model("users");
const isEmployee = async (request, response, next) => {
  const token = request.header("x-auth-token");
  if (!token) {
    return responseHandler.error(
      UNAUTHORIZED,
      "System rejected. No access token found!",
      response
    );
  }
  try {
    const { id } = jwt.verify(token, process.env.JWTSECRET);
    const user = await userModel.select("*", "id=$1", [id]);
    if (!user.length) {
      return responseHandler.error(
        UNAUTHORIZED,
        "Awww, snap! Employee and access token mismatch",
        response
      );
    }
    next();
  } catch (error) {
    return responseHandler.error(BAD_REQUEST, error.message, response);
  }
};

export default isEmployee;
