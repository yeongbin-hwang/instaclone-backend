jest.mock("../models/user");
jest.mock("../models/post");
jest.mock("../models/comment");
jest.mock("../models/hashtag");
jest.mock("jsonwebtoken");
const { Post, User, Comment, Hashtag } = require("../models");
const jwt = require("jsonwebtoken");
const { login, signup, verifyCheck } = require("./auth");

describe("verifyCheck", () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  test("If no token, call next(403)", async () => {
    const req = {
      headers: {
        authorization: {
          startsWith: jest.fn(() => {
            return true;
          }),
          split: jest.fn(() => {
            return [null, null];
          }),
        },
      },
    };
    await verifyCheck(req, res, next);
    expect(next).toBeCalledWith({
      message: "You need to be logged in to visit this route",
      statusCode: 403,
    });
  });

  const req = {
    headers: {
      authorization: {
        startsWith: jest.fn(() => {
          return true;
        }),
        split: jest.fn(() => {
          return [true, true];
        }),
      },
    },
  };
  jwt.verify.mockReturnValue({ email: "yb@yb" });

  test("If valid token, call next", async () => {
    User.findOne.mockReturnValue(
      Promise.resolve({
        username: "yb",
        fullname: "yb",
        email: "yb@yb",
        avatar: "yb",
      })
    );
    await verifyCheck(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      success: true,
      data: {
        username: "yb",
        fullname: "yb",
        email: "yb@yb",
        avatar: "yb",
      },
    });
  });

  test("If not valid token, call status(403)", async () => {
    User.findOne.mockReturnValue(Promise.resolve(null));
    await verifyCheck(req, res, next);
    expect(next).toBeCalledWith({
      message: "no user found for email yb@yb",
    });
  });

  test("If not valid token, call error", async () => {
    User.findOne.mockReturnValue(Promise.reject());
    await verifyCheck(req, res, next);
    expect(next).toBeCalledWith({
      message: "You need to be logged in to visit this route",
      statusCode: 403,
    });
  });
});
