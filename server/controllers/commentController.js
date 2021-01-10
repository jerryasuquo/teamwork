import dateTime from "node-datetime";
import Model from "../models/Model";
import decodeEmployeeIdFromToken from "../helpers/tokenDecoder";
import responseHandler from "../helpers/responseHandler";
import { RESOURCE_CREATED, SERVER_ERROR } from "../helpers/statusCode";

class CommentController {
  static commentModel() {
    return new Model("comments");
  }

  static commentOnPost = async (request, response) => {
    try {
      const employeeToken = request.header("x-auth-token").trim();

      let { postId } = request.params;

      const currentDate = dateTime.create().format("m/d/y h:m:s");

      const authorId = decodeEmployeeIdFromToken(employeeToken, response);

      const attributes = "author_id, post_id,comment, created_on, updated_on";

      const selectors = `'${authorId}', '${postId}', '${request.body.comment}', '${currentDate}', '${currentDate}'`;

      const createdComment = await this.commentModel().insert(
        attributes,
        selectors
      );

      let {
        id,
        author_id,
        post_id,
        comment,
        created_on,
        updated_on,
      } = createdComment[0];

      let responseObj = {
        id,
        authorId: author_id,
        postId: post_id,
        comment,
        createdOn: created_on,
        updatedOn: updated_on,
      };

      return responseHandler.success(
        RESOURCE_CREATED,
        "comment successfully added",
        responseObj,
        response
      );
    } catch (err) {
      return responseHandler.error(
        SERVER_ERROR,
        `Oops, internal server error occurred: ${err} `,
        response
      );
    }
  };
}

export default CommentController;
