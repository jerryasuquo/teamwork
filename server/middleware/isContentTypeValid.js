import { UNSUPPORTED_CONTENT_TYPE } from "../helpers/statusCode";

const isValidContentType = (request, response, next) => {
  const contentType = request.headers["content-type"];
  if (!contentType || contentType.indexOf("application/json") !== 0) {
    return response.status(UNSUPPORTED_CONTENT_TYPE).send({
      status: UNSUPPORTED_CONTENT_TYPE,
      error: "content type for request must be application/json",
    });
  }
  next();
};

export default isValidContentType;
