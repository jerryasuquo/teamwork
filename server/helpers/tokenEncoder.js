import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const genAuthToken = (id, email) => {
  const token = jwt.sign({ id, email }, process.env.JWTSECRET);
  return token;
};

export default genAuthToken;
