import express from "express";
import postController from "../controllers/postController";
import commentController from "../controllers/commentController";
import isEmployee from "../middleware/isEmployee";
import isContentTypeValid from "../middleware/isContentTypeValid";
import {
  isPostReqValid,
  isOwner,
  isCommentReqValid,
  doesExist,
} from "../middleware/validator";

const router = express.Router();

const {
  createPost,
  getPost,
  editPost,
  deletePost,
  getAllPosts,
  getSelectPost,
} = postController;
const { commentOnPost } = commentController;

router.post(
  "/posts",
  isContentTypeValid,
  isEmployee,
  isPostReqValid,
  createPost
);

router.get("/posts", isEmployee, getPost);

router.patch(
  "/posts/:postid",
  isEmployee,
  isOwner,
  editPost,
  isPostReqValid,
  isContentTypeValid
);

router.delete("/posts/:postid", isEmployee, isOwner, deletePost);

router.get("/feeds", isEmployee, getAllPosts);

router.get("/posts/:postid", isEmployee, doesExist, getSelectPost);

router.post(
  "/posts/:postid/comment",
  isEmployee,
  doesExist,
  commentOnPost,
  isCommentReqValid,
  isContentTypeValid
);

export default router;
