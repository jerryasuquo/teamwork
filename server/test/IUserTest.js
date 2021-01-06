import app from "../index";
import chai from "chai";
import chaiHTTP from "chai-http";
import user from "../models/dummyData/user";
import {
  NOT_FOUND,
  UNSUPPORTED_CONTENT_TYPE,
  BAD_REQUEST,
  REQUEST_CONFLICT,
  RESOURCE_CREATED,
  UNAUTHORIZED,
  REQUEST_SUCCEDED as REQUEST_SUCCEEDED,
} from "../helpers/statusCode";

const { expect } = chai;

chai.use(chaiHTTP);

describe("POST api/v2/auth/signup when no valid URL endpoint exists", () => {
  it("should return such URI does not exist on our server", (done) => {
    chai
      .result(app)
      .post("/")
      .set("Accept", "application/json")
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(NOT_FOUND);
        expect(response.body.status).to.equal(
          "Hello, and welcome to Teamwork API"
        );
        done();
      });
  });
});

describe("POST api/v2/auth/signup Content type not supported", () => {
  it("should return content type is unsupported", (done) => {
    chai
      .request(app)
      .post("/api/v2/auth/signup")
      .set("Accept", "application/json")
      .set("Content-Type", "text/plain")
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(UNSUPPORTED_CONTENT_TYPE);
        expect(response.body.status).to.equal(UNSUPPORTED_CONTENT_TYPE);
        expect(response.body.error).to.equal(
          "content type for request must be application/json"
        );
        done();
      });
  });
});

describe("POST api/v2/auth/signup misspelling in JSON format", () => {
  it("should return request is invalid JSON format", (done) => {
    chai
      .request(app)
      .post("/api/v2/auth/signup")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send("{'invalidJSON'}")
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal(
          "The JSON request you made is invalid!"
        );
        done();
      });
  });
});

describe("POST api/v2/auth/signup firstName is missing", () => {
  it("should return firstName is required", (done) => {
    chai
      .request(app)
      .post("/api/v2/auth/signup")
      .set("Accept", "application/json")
      .send(user[0])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal("'firstName' is required");
        done();
      });
  });
});

describe("POST api/v2/auth/signup some fields in payload are empty", () => {
  it("should return request has empty fields", (done) => {
    chai
      .request(app)
      .post("/api/v2/auth/signup")
      .set("Accept", "application/json")
      .send(user[1])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal(
          "'firstName' is not allowed to be empty"
        );
        done();
      });
  });
});

describe("POST api/v2/auth/signup some fields can not be numbers", () => {
  it("should return request has some disallowed data", (done) => {
    chai
      .request(app)
      .post("/api/v2/auth/signup")
      .set("Accept", "application/json")
      .send(user[2])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(BAD_REQUEST);
        expect(response.body.status).to.equal(BAD_REQUEST);
        expect(response.body.error).to.equal(
          "firstName, lastName, jobRole, department, and address can't be a number!"
        );
        done();
      });
  });
});

describe("POST api/v2/auth/signup email must be unique", () => {
  it("should return email exists there", (done) => {
    chai
      .request(app)
      .post("/api/v2/auth/signup")
      .set("Accept", "application/json")
      .send(user[4])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(REQUEST_CONFLICT);
        expect(response.body.status).to.equal(REQUEST_CONFLICT);
        expect(response.body.error).to.equal("Email has been taken!");
        done();
      });
  });
});

describe("POST api/v2/auth/signup creating employee account", () => {
  it("should return account is created successfully", (done) => {
    chai
      .request(app)
      .post("/api/v2/auth/signup")
      .set("Accept", "application/json")
      .send(user[5])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(RESOURCE_CREATED);
        expect(response.body.status).to.equal(RESOURCE_CREATED);
        expect(response.body.message).to.equal("User created successfully");
        done();
      });
  });
});

describe("POST api/v2/auth/signin email is missing", () => {
  it("should return email is required", (done) => {
    chai
      .request(app)
      .post("/api/v2/auth/signin")
      .set("Accept", "application/json")
      .send(user[6])
      .end((error, res) => {
        expect(res.body).to.be.an("object");
        expect(res.status).to.equal(BAD_REQUEST);
        expect(res.body.status).to.equal(BAD_REQUEST);
        expect(res.body.error).to.equal("'email' is required");
        done();
      });
  });
});

describe("POST api/v2/auth/signin employee signin success", () => {
  it("should return user is signed successfully", (done) => {
    chai
      .request(app)
      .post("/api/v2/auth/signin")
      .set("Accept", "application/json")
      .send(user[7])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(REQUEST_SUCCEEDED);
        expect(response.body.status).to.equal(REQUEST_SUCCEEDED);
        expect(response.body.message).to.equal(
          "User is successfully logged in"
        );
        done();
      });
  });
});

describe("POST api/v2/auth/signin employee signin failure", () => {
  it("should return user is not logged in", (done) => {
    chai
      .request(app)
      .post("/api/v2/auth/signin")
      .set("Accept", "application/json")
      .send(user[8])
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        expect(response.status).to.equal(UNAUTHORIZED);
        expect(response.body.status).to.equal(UNAUTHORIZED);
        expect(response.body.error).to.equal("email or password is incorrect!");
        done();
      });
  });
});
