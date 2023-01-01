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

describe("getFeeds", () => {
  const req = {
    user: {
      id: 1,
      Followings: [
        {
          id: 2,
        },
      ],
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("Get feeds information, return status(200)", async () => {
    const posts = [];
    Post.findAll.mockReturnValue(Promise.resolve(posts));
    await getFeeds(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true, data: posts });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    Post.findAll.mockReturnValue(Promise.reject(error));
    await getFeeds(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("getProfile", () => {
  const req = {
    user: {
      id: 1,
    },
    params: {
      username: "yb",
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("No user profile, return status(403)", async () => {
    User.findOne.mockReturnValue(Promise.resolve(null));
    await getProfile(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({
      message: "wrong profile",
      status: 403,
    });
  });

  test("Get user profile, return status(200)", async () => {
    const user = {
      id: 1,
      setDataValue: jest.fn(),
      SavePosts: [],
      Posts: [],
      Followings: [],
      Followers: [],
    };
    User.findOne.mockReturnValue(Promise.resolve(user));
    await getProfile(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true, data: user });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    User.findOne.mockReturnValue(Promise.reject(error));
    await getProfile(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("updateProfile", () => {
  const req = {
    user: {
      id: 1,
    },
    body: {
      fullname: "yeongbinhwang",
      username: "yb",
      website: "www.naver.com",
      bio: "hi",
      avatar: "hi",
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("Update profile, return status(201)", async () => {
    const user = {};
    User.update.mockReturnValue(Promise.resolve(true));
    User.findOne.mockReturnValue(Promise.resolve(user));
    await updateProfile(req, res, next);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({ success: true, data: user });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    User.update.mockReturnValue(Promise.reject(error));
    await updateProfile(req, res, next);
    expect(next).toBeCalledWith(error);
  });

  test("Invalid name, return status(403)", async () => {
    req.body.fullname = null;
    await updateProfile(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({ message: "please enter the name" });
  });
});

describe("getSuggestionFollowing", () => {
  const req = {
    user: {
      id: 1,
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("Get suggestion following, return status(200)", async () => {
    const myUser = {
      Followings: {
        map: jest.fn(() => myUser),
      },
      concat: jest.fn(() => []),
    };
    const users = {
      filter: jest.fn(() => []),
    };
    User.findOne.mockReturnValue(Promise.resolve(myUser));
    User.findAll.mockReturnValue(Promise.resolve(users));
    await getSuggestionFollowing(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true, data: [] });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    User.findOne.mockReturnValue(Promise.reject(error));
    await getSuggestionFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
