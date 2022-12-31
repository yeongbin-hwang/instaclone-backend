jest.mock("jsonwebtoken");
jest.mock("./models/user");
jest.mock("./utils/jwt-util");

const jwt = require("jsonwebtoken");
const User = require("./models/user");
const { sign, verify, refreshVerify } = require("./utils/jwt-util");

const { verifyToken } = require("./middlewares");

describe("verifyToken", () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("If no token, call status(401)", async () => {
    const req = {
      headers: {
        authorization: "hi",
      },
    };
    await verifyToken(req, res, next);
    expect(next).toBeCalledWith({
      message: "you do not have token",
      status: 401,
    });
  });

  const req = {
    headers: {
      authorization: {
        startsWith: jest.fn(() => {
          return true;
        }),
        split: jest.fn(() => {
          return [0, "accesstoken"];
        }),
      },
      refresh: "refreshtoken",
    },
  };
  test("1. access token expired and refresh token expired", async () => {
    verify.mockReturnValue({
      ok: false,
    });
    jwt.decode.mockReturnValue({
      email: "yeongbin@naver.com",
    });
    refreshVerify.mockReturnValue(Promise.resolve(false));
    await verifyToken(req, res, next);
    expect(next).toBeCalledWith({
      message: "Both token are expired",
      status: 401,
    });
  });

  test("2. access token expired and refresh token valid", async () => {
    verify.mockReturnValue({
      ok: false,
    });
    jwt.decode.mockReturnValue({
      email: "yeongbin@naver.com",
    });
    refreshVerify.mockReturnValue(Promise.resolve(true));
    sign.mockReturnValue("newaccesstoken");
    await verifyToken(req, res, next);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      success: true,
      accessToken: "newaccesstoken",
    });
  });

  test("3. access token valid", async () => {
    verify.mockReturnValue({
      ok: true,
      email: "yeongbin@naver.com",
    });
    User.findOne.mockReturnValue(Promise.resolve(true));
    await verifyToken(req, res, next);
    expect(next).toBeCalledWith();
  });
  test("4. access token valid, but no user in db", async () => {
    verify.mockReturnValue({
      ok: true,
      email: "yeongbin@naver.com",
    });
    const error = "db error";
    User.findOne.mockReturnValue(Promise.resolve(null));
    await verifyToken(req, res, next);
    expect(next).toBeCalledWith({
      message: "your token is invalid",
      status: 401,
    });
  });
});
