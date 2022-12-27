jest.mock("jsonwebtoken");
jest.mock("./models/user");

const jwt = require("jsonwebtoken");
const User = require("./models/user");

const { verifyToken } = require("./middlewares");

describe("verifyToken", () => {
  const res = {};
  const next = jest.fn();
  test("If no token, call status(403)", async () => {
    const req = {
      headers: {
        authorization: null,
      },
    };
    User.findOne.mockReturnValue(Promise.resolve(true));
    await verifyToken(req, res, next);
    expect(next).toBeCalledWith();
  });

  const req = {
    headers: {
      authorization: {
        startsWith: jest.fn(() => {
          true;
        }),
        split: jest.fn(() => {
          [0, 1];
        }),
      },
    },
  };
  jwt.verify.mockReturnValue(true);
  test("If valid token, call next", async () => {
    User.findOne.mockReturnValue(Promise.resolve(true));
    await verifyToken(req, res, next);
    expect(next).toBeCalledWith();
  });

  test("If not valid token, call status(403)", async () => {
    User.findOne.mockReturnValue(null);
    await verifyToken(req, res, next);
    expect(next).toBeCalledWith({
      message: "your token is invalid",
      status: 401,
    });
  });

  test("If not valid token, call error", async () => {
    const error = "db error";
    User.findOne.mockReturnValue(Promise.reject(error));
    await verifyToken(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
