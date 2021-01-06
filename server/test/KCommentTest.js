import chai from "chai";
import chaiHTTP from "chai-http";
import dotenv from "dotenv";
import comment from "../models/dummyData/comment";
import genAuthToken from "../helpers/tokenEncoder";
import app from "../index";
import {
  NOT_FOUND,
  BAD_REQUEST,
  RESOURCE_CREATED,
} from "../helpers/statusCode";

const { expect } = chai;

chai.use(chaiHTTP);

dotenv.config();

const validToken = genAuthToken(1);

describe("POST api/v2/posts/:postId with Invalid signature token", () => {
  it("should return Invalid token", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts/2/comments")
      .set("Accept", "application/json")
      .set("x-auth-token", process.env.INVALID_TOKEN)
      .send(comment[2])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        done();
      });
  });
});

describe("POST api/v2/posts comment field is missing", () => {
  it("should return comment is required", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts/1/comments")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .send(comment[0])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal('"comment" is required');
        done();
      });
  });
});

describe("POST /api/v2/posts/:postId/comments postId param", () => {
  it("should return postId param can not be a string", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts/mm/comments")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .send(comment[2])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal("postId can't be a string!");
        done();
      });
  });
});

describe("POST /api/v2/posts/:postId/comments", () => {
  it("should return comment cannot be empty", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts/1/comments")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("x-auth-token", validToken)
      .send(comment[1])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal("'comment' can't be empty");
        done();
      });
  });
});

describe("POST /api/v2/posts/:postId/comments postId param", () => {
  it("should return post is not found", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts/900/comments")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("x-auth-token", validToken)
      .send(comment[2])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(NOT_FOUND);
        expect(response.body.status).to.equal(NOT_FOUND);
        expect(response.body.error).to.equal("Such post is not found!");
        done();
      });
  });
});

describe("POST /api/v2/posts/:postId/comments adding comment", () => {
  it("should return comment successfully added", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts/2/comments")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("x-auth-token", validToken)
      .send(comment[2])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(RESOURCE_CREATED);
        expect(response.body.status).to.equal(RESOURCE_CREATED);
        expect(response.body.message).to.equal("comment successfully added");
        done();
      });
  });
});
