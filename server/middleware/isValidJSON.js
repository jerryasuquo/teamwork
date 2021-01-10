import { BAD_REQUEST } from "../helpers/statusCode";
import responseHandler from "../helpers/responseHandler";

const isValidJSON = (err, request, response, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return responseHandler.err(
      BAD_REQUEST,
      "The JSON request you made is invalid!",
      response
    );
  }
  next();
};

export default isValidJSON;
