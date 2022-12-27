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
    user: {
      id: 1,
      addFollowings: jest.fn(),
    },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("run addFollowings, return status(200)", async () => {
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    req.user.addFollowings = jest.fn(() => {
      return Promise.reject(error);
    });
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("removeFollowing", () => {
  const req = {
    user: {
      id: 1,
      removeFollowings: jest.fn(),
    },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("run removeFollowings, return status(200)", async () => {
    await removeFollowing(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    req.user.removeFollowings = jest.fn(() => {
      return Promise.reject(error);
    });
    await removeFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
