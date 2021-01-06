import Model from "../models/Model";
import genAuthToken from "../helpers/tokenEncoder";
import pcrypt from "../helpers/pcrypt";
import pmatch from "../helpers/pmatch";
import responseHandler from "../helpers/responseHandler";
import {
  REQUEST_CONFLICT,
  RESOURCE_CREATED,
  REQUEST_SUCCEEDED,
  UNAUTHORIZED,
  SERVER_ERROR,
} from "../helpers/statusCode";

class UserController {
  static userModel() {
    return new Model("users");
  }

  static signup = async (request, response) => {
    try {
      let {
        firstName,
        lastName,
        email,
        password,
        address,
        gender,
        jobRole,
        department,
      } = request.body;

      const row = await this.userModel().select("*", "email=$1", [email]);

      if (row[0]) {
        return responseHandler.error(
          REQUEST_CONFLICT,
          "Email has been taken!",
          response
        );
      }

      password = await pcrypt(password);

      const attributes =
        "first_name, last_name, email, password, gender, job_role, department, address";

      const selectors = `"${firstName}", "${lastName}, "${email}, "${password}, "${gender}, "${jobRole}, "${department}, "${address}"`;

      const insertedRow = await this.userModel().insert(attributes, selectors);

      const token = genAuthToken(insertedRow[0].id, insertedRow[0].email);

      return responseHandler.success(
        RESOURCE_CREATED,
        "User created successfully",
        { token },
        response
      );
    } catch (err) {
      return responseHandler.error(
        SERVER_ERROR,
        `Oops, interval server error occurred: ${err}`,
        response
      );
    }
  };

  static signin = async (request, response) => {
    try {
      let { email, password } = request.body;

      const row = await this.userModel().select("*", "email=$1", [email]);

      if (row[0] && pmatch(password, row[0].password)) {
        const token = genAuthToken(row[0].id, row[0].email);

        return responseHandler.success(
          REQUEST_SUCCEEDED,
          "User is successfully logged in",
          { token },
          response
        );
      }

      return responseHandler.error(
        UNAUTHORIZED,
        "email or password is incorrect!",
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

export default UserController;
