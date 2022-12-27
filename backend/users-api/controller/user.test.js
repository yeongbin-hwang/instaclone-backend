jest.mock("../models/user");
jest.mock("../models/post");
jest.mock("../models/comment");
jest.mock("../models/hashtag");
const { Post, User, Comment, Hashtag } = require("../models");
const {
  addFollowing,
  removeFollowing,
  getFeeds,
  getProfile,
  updateProfile,
  getSuggestionFollowing,
} = require("./users");

describe("addFollowing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("if find user, return status(200)", async () => {
    User.findOne.mockReturnValue(
      Promise.resolve({
        id: 1,
        name: "yb",
        addFollowings(id) {
          return Promise.resolve(true);
        },
      })
    );
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true });
  });

  test("if not find user, return status(403)", async () => {
    User.findOne.mockReturnValue(Promise.resolve(null));
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({
      message: "my information is deleted",
      status: 403,
    });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    User.findOne.mockReturnValue(Promise.reject(error));
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("removeFollowing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("if find user, return status(200)", async () => {
    User.findOne.mockReturnValue(
      Promise.resolve({
        id: 1,
        name: "yb",
        removeFollowings(id) {
          return Promise.resolve(true);
        },
      })
    );
    await removeFollowing(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true });
  });

  test("if not find user, return status(403)", async () => {
    User.findOne.mockReturnValue(Promise.resolve(null));
    await removeFollowing(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({
      message: "my information is deleted",
      status: 403,
    });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    User.findOne.mockReturnValue(Promise.reject(error));
    await removeFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
