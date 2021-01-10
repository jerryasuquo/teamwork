import chai from "chai";
import chaiHTTP from "chai-http";
import dotenv from "dotenv";
import app from "../index";
import post from "../model/dummyData/post";
import genAuthToken from "../helper/tokenEncoder";
import {
  NOT_FOUND,
  BAD_REQUEST,
  RESOURCE_CREATED,
  REQUEST_SUCCEEDED,
  UNAUTHORIZED,
  FORBIDDEN,
} from "../helpers/statusCode";

const { expect } = chai;

chai.use(chaiHTTP);
dotenv.config();

const validToken = genAuthToken(1);
const ownerToken = genAuthToken(2);
const noToken = " ";
const noUserWithToken = genAuthToken(89);

describe("POST api/v2/posts title is missing", () => {
  it("should return title is required", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .send(post[0])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal("'title' is required");
        done();
      });
  });
});

describe("POST api/v2/posts some fields in payload are empty", () => {
  it("should return request has empty fields", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .send(post[1])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal("title or post can't be empty");
        done();
      });
  });
});

describe("POST api/v2/posts title and posts can not be numbers!", () => {
  it("should return request has some disallowed data", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts")
      .set("Accept", "application/json")
      .send(post[2])
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal(
          "title or post can't be a number!"
        );
        done();
      });
  });
});

describe("POST api/v2/posts creating an post", () => {
  it("should return an post is created successfully", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts")
      .set("Accept", "application/json")
      .send(post[3])
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(RESOURCE_CREATED);
        expect(response.body.status).to.equal(RESOURCE_CREATED);
        expect(response.body.message).to.equal("post successfully created");
        done();
      });
  });
});

describe("POST api/v2/posts creating an post with Invalid token", () => {
  it("should return an post failed", (done) => {
    chai
      .request(app)
      .post("/api/v2/post")
      .set("Accept", "application/json")
      .send(article[3])
      .set("x-auth-token", process.env.INVALID_TOKEN)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        done();
      });
  });
});

describe("POST api/v2/posts creating an post with no token", () => {
  it("should return creating an post failed", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts")
      .set("Accept", "application/json")
      .send(article[3])
      .set("x-auth-token", noToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(UNAUTHORIZED);
        expect(response.body.status).to.equal(UNAUTHORIZED);
        expect(response.body.error).to.equal(
          "System rejected. No access token found!"
        );
        done();
      });
  });
});

describe("POST api/v2/posts creating an post with invalid token", () => {
  it("should return creating an post failed", (done) => {
    chai
      .request(app)
      .post("/api/v2/posts")
      .set("Accept", "application/json")
      .send(article[3])
      .set("x-auth-token", noUserWithToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(UNAUTHORIZED);
        expect(response.body.status).to.equal(UNAUTHORIZED);
        expect(response.body.error).to.equal(
          "Awww, Snap!..Such kind of access token does not match any employee!"
        );
        done();
      });
  });
});

describe("PATCH api/v2/posts/:postId title is missing", () => {
  it("should return title is required", (done) => {
    chai
      .request(app)
      .patch("/api/v2/posts/1")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .send(post[0])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal('"title" is required');
        done();
      });
  });
});

describe("PATCH api/v2/posts/:postId some fields in payload are empty", () => {
  it("should return request has empty fields", (done) => {
    chai
      .request(app)
      .patch("/api/v2/posts/1")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .send(post[1])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal(
          '"title" is not allowed to be empty'
        );
        done();
      });
  });
});

describe("PATCH api/v2/posts/:postId title and post cannot be numbers!", () => {
  it("should return request has some disallowed data", (done) => {
    chai
      .request(app)
      .patch("/api/v2/posts/1")
      .set("Accept", "application/json")
      .send(post[2])
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal(
          "title or post can't be a number!"
        );
        done();
      });
  });
});

describe("PATCH api/v2/posts/:postId postId param", () => {
  it("should return postId param can not be a string", (done) => {
    chai
      .request(app)
      .patch("/api/v2/posts/mm")
      .set("Accept", "application/json")
      .send(post[3])
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal("postId can't be a string!");
        done();
      });
  });
});

describe("PATCH api/v2/posts/:postId postId param", () => {
  it("should return postId param is not found", (done) => {
    chai
      .request(app)
      .patch("/api/v2/posts/900")
      .set("Accept", "application/json")
      .send(article[3])
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(NOT_FOUND);
        expect(response.body.status).to.equal(NOT_FOUND);
        expect(response.body.error).to.equal("Such a post doesn't exist!");
        done();
      });
  });
});

describe("PATCH api/v2/posts/:postId post ownership", () => {
  it("should return you are not owner of an post", (done) => {
    chai
      .request(app)
      .patch("/api/v2/posts/1")
      .set("Accept", "application/json")
      .send(post[3])
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(FORBIDDEN);
        expect(response.body.status).to.equal(FORBIDDEN);
        expect(response.body.error).to.equal(
          "Aww snap!.. you are not the owner of a post"
        );
        done();
      });
  });
});

describe("PATCH api/v2/posts/:postId post ", () => {
  it("should return post successfully edited", (done) => {
    chai
      .request(app)
      .patch("/api/v2/posts/1")
      .set("Accept", "application/json")
      .send(post[3])
      .set("x-auth-token", ownerToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(REQUEST_SUCCEDED);
        expect(response.body.status).to.equal(REQUEST_SUCCEDED);
        expect(response.body.message).to.equal("post successfully edited");
        done();
      });
  });
});

describe("DELETE api/v2/articles/:articleId articleId param", () => {
  it("should return articleId param can not be a string", (done) => {
    chai
      .request(app)
      .delete("/api/v2/posts/mm")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal("postId can't be a string!");
        done();
      });
  });
});

describe("DELETE api/v2/posts/:postId postId param", () => {
  it("should return postId param is not found", (done) => {
    chai
      .request(app)
      .delete("/api/v2/posts/900")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(NOT_FOUND);
        expect(response.body.status).to.equal(NOT_FOUND);
        expect(response.body.error).to.equal("Such post is not found!");
        done();
      });
  });
});

describe("DELETE api/v2/posts/:postId post ownership", () => {
  it("should return you are not owner of an post", (done) => {
    chai
      .request(app)
      .delete("/api/v2/posts/1")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(FORBIDDEN);
        expect(response.body.status).to.equal(FORBIDDEN);
        expect(response.body.error).to.equal(
          "Aww snap!.. you are not the owner of an post"
        );
        done();
      });
  });
});

describe("DELETE api/v2/posts/:postId post ", () => {
  it("should return post successfully deleted", (done) => {
    chai
      .request(app)
      .delete("/api/v2/articles/1")
      .set("Accept", "application/json")
      .set("x-auth-token", ownerToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(REQUEST_SUCCEEDED);
        expect(response.body.status).to.equal(REQUEST_SUCCEEDED);
        expect(response.body.message).to.equal("post successfully deleted");
        done();
      });
  });
});

describe("GET api/v2/feeds Get all posts ", () => {
  it("should return an array of All posts ", (done) => {
    chai
      .request(app)
      .get("/api/v2/feeds")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(REQUEST_SUCCEDED);
        expect(response.body.status).to.equal(REQUEST_SUCCEDED);
        expect(response.body.message).to.equal("success");
        done();
      });
  });
});

describe("GET api/v2/posts/:postId postId param", () => {
  it("should return postId param can not be a string", (done) => {
    chai
      .request(app)
      .get("/api/v2/posts/mm")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal("postId can't be a string!");
        done();
      });
  });
});

describe("GET api/v2/posts/:postId postId param", () => {
  it("should return postId param is not found", (done) => {
    chai
      .request(app)
      .get("/api/v2/articles/900")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(NOT_FOUND);
        expect(response.body.status).to.equal(NOT_FOUND);
        expect(response.body.error).to.equal("Such post is not found!");
        done();
      });
  });
});

describe("GET api/v2/posts/:postId Get post by Id", () => {
  it("should return a certain post", (done) => {
    chai
      .request(app)
      .get("/api/v2/posts")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(REQUEST_SUCCEDED);
        expect(response.body.status).to.equal(REQUEST_SUCCEDED);
        expect(response.body.message).to.equal(
          "Your posts returned successfully"
        );
        done();
      });
  });
});

describe("GET api/v2/posts My posts", () => {
  it("should return my posts", (done) => {
    chai
      .request(app)
      .get("/api/v2/posts/2")
      .set("Accept", "application/json")
      .set("x-auth-token", validToken)
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(REQUEST_SUCCEDED);
        expect(response.body.status).to.equal(REQUEST_SUCCEDED);
        done();
      });
  });
});
