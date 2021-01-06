import joi from "joi";
import responseHandler from "../helpers/responseHandler";
import Model from "../models/Model";
import decodeEmployeeIdFromToken from "../helpers/tokenDecoder";
import { BAD_REQUEST, NOT_FOUND, FORBIDDEN } from "../helpers/statusCode";

const postModel = new Model("posts");

const validateData = (input) => {
  const model = input.replace(/[^a-zA-Z\d]/g, "");

  if (model) return true;
  return false;
};

const isGenderValid = (gender) => {
  if (
    gender === "Female" ||
    gender === "F" ||
    gender === "Male" ||
    gender === "M"
  ) {
    return true;
  }
  return false;
};

const isSignupReqValid = (request, response, next) => {
  const schema = {
    firstName: joi.string().min(4).trim().required(),
    lastName: joi.string().min(4).trim().required(),
    email: joi.string().email().trim().required(),
    password: joi.string().min(8).required(),
    address: joi.string().trim().required(),
    gender: joi.string().trim().required(),
    jobRole: joi.string().trim().required(),
    department: joi.string().trim().required(),
  };

  const result = joi.validate(request.body, schema);

  if (result.error !== null) {
    return responseHandler.error(
      BAD_REQUEST,
      `${request.error.details[0].message}`,
      response
    );
  }

  let {
    firstName,
    lastName,
    password,
    address,
    gender,
    jobRole,
    department,
  } = request.body;

  if (
    !validateData(firstName) ||
    !validateData(lastName) ||
    !validateData(address) ||
    !validateData(gender) ||
    !validateData(jobRole) ||
    !validateData(department) ||
    !validateData(password)
  ) {
    return responseHandler.error(
      BAD_REQUEST,
      "firstName, lastName, address, gender, jobRole, department, password can't be empty",
      response
    );
  }

  if (
    !isNaN(firstName) ||
    !isNaN(lastName) ||
    !isNaN(jobRole) ||
    !isNaN(department) ||
    !isNaN(address)
  ) {
    return responseHandler.error(
      BAD_REQUEST,
      "firstName, lastName, jobRole, department, and address can't be a number!",
      response
    );
  }

  if (!isGenderValid(gender.toLowerCase().trim())) {
    return responseHandler.error(
      BAD_REQUEST,
      "it seems that gender is invalid!",
      response
    );
  }
  next();
};

const isSigninReqValid = (request, response, next) => {
  const schema = {
    email: joi.string().email().trim().required(),
    password: joi.required(),
  };

  const result = joi.validate(request.body, schema);

  if (result.error !== null) {
    return responseHandler.error(
      BAD_REQUEST,
      `${result.error.details[0].message}`,
      response
    );
  }
  next();
};

const isPostReqValid = (request, response, next) => {
  const schema = {
    title: joi.string().trim().required(),
    post: joi.string().trim().required(),
  };

  const result = joi.validate(request.body, schema);

  if (result.error !== null) {
    return responseHandler.error(
      BAD_REQUEST,
      `${result.error.details[0].message}`,
      response
    );
  }

  let { title, post } = request.body;

  if (!validateData(title) || !validateData(post)) {
    return responseHandler.error(
      BAD_REQUEST,
      "title or post can't be empty",
      response
    );
  }

  if (!isNaN(title) || !isNaN(post)) {
    return responseHandler.error(
      BAD_REQUEST,
      "title or post can't be a number!",
      response
    );
  }
  next();
};

const isOwner = async (request, response, next) => {
  const employeeToken = request.header("x-auth-token").trim();

  let { postId } = request.params;

  if (isNaN(postId)) {
    return responseHandler.error(
      BAD_REQUEST,
      "postId can't be a string!",
      response
    );
  }

  const post = await postModel.select("*", "id=$1", [postId]);
  if (!post.length) {
    return responseHandler.error(
      NOT_FOUND,
      "Such article is not found!",
      response
    );
  }

  const authorId = decodeEmployeeIdFromToken(employeeToken, response);

  if (!(post[0].authorId === authorId)) {
    return responseHandler.error(
      FORBIDDEN,
      "Aww snap!.. you are not the owner of a post",
      response
    );
  }
  next();
};

const isCommentReqValid = (request, response, next) => {
  const schema = {
    comment: joi.string().trim().required(),
  };

  const result = joi.validate(request.body, schema);

  if (result.error !== null) {
    return responseHandler.error(
      BAD_REQUEST,
      `${result.error.details[0].message}`,
      response
    );
  }

  let { comment } = request.body;

  let { postId } = request.params;

  postId = postId.trim();

  if (isNaN(postId)) {
    return responseHandler.error(
      BAD_REQUEST,
      "postId can't be a string!",
      response
    );
  }

  if (!validateData(comment)) {
    return responseHandler.error(
      BAD_REQUEST,
      "comment can't be empty",
      response
    );
  }
  next();
};

const doesExist = async (request, response, next) => {
  let { postId } = request.params;

  postId = postId.trim();

  if (isNaN(postId)) {
    return responseHandler.error(
      BAD_REQUEST,
      "postId can't be a string!",
      response
    );
  }

  const postFound = await postModel.select("*", "id=$1", [postId]);

  if (!postFound.length) {
    return responseHandler.error(
      NOT_FOUND,
      "Such a post doesn't exist!",
      response
    );
  }
  next();
};

export {
  isSignupReqValid,
  isSigninReqValid,
  isPostReqValid,
  isOwner,
  isCommentReqValid,
  doesExist,
};
