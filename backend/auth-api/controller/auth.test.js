const { login, signup, verifyCheck } = require("./auth");

describe("verifyCheck", () => {
  const req = {
    user: {
      username: "yb",
      fullname: "yb",
      email: "yb@yb",
      avatar: "yb",
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  test("If valid token, call next", async () => {
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
});
