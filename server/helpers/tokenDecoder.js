import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BAD_REQUEST } from "./statusCode";

dotenv.config();

const decodeEmployeeIdFromToken = (token, response) => {
  try {
    const { id } = jwt.verify(token, process.env.JWTSECRET);

    return id;
  } catch (error) {
    return response.status(BAD_REQUEST).send({
      status: BAD_REQUEST,
      error: error.message,
    });
  }
};

export default decodeEmployeeIdFromToken;
