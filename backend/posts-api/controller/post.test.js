jest.mock("../models/user");
jest.mock("../models/post");
jest.mock("../models/comment");
jest.mock("../models/hashtag");
const { Post, User, Comment, Hashtag } = require("../models");
const {
  toggleLike,
  toggleSave,
  deletePost,
  getPosts,
  getDetailPost,
  uploadPost,
  uploadComment,
} = require("./posts");

describe("toggleLike", () => {
  const req = {
    user: {
      id: 1,
      addLikePost: jest.fn(() => Promise.resolve(true)),
    },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("run toggleLike (remove toggle), return status(200)", async () => {
    const user = {
      removeLikePost: jest.fn(() => Promise.resolve(true)),
    };
    User.findOne.mockReturnValue(Promise.resolve(user));
    await toggleLike(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true });
  });

  test("run toggleLike (add toggle), return status(200)", async () => {
    const user = null;
    User.findOne.mockReturnValue(Promise.resolve(user));
    await toggleLike(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    User.findOne.mockReturnValue(Promise.reject(error));
    await toggleLike(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
describe("toggleSave", () => {
  const req = {
    user: {
      id: 1,
      addSavePost: jest.fn(() => Promise.resolve(true)),
    },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("run toggleSave (remove toggle), return status(200)", async () => {
    const user = {
      removeSavePost: jest.fn(() => Promise.resolve(true)),
    };
    User.findOne.mockReturnValue(Promise.resolve(user));
    await toggleSave(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true });
  });

  test("run toggleSave (add toggle), return status(200)", async () => {
    const user = null;
    User.findOne.mockReturnValue(Promise.resolve(user));
    await toggleSave(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    User.findOne.mockReturnValue(Promise.reject(error));
    await toggleSave(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
describe("deletePost", () => {
  const req = {
    user: {
      id: 1,
    },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("Do not have post, return status(403)", async () => {
    const post = null;
    Post.findOne.mockReturnValue(Promise.resolve(post));
    await deletePost(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({ message: "do not have the post" });
  });

  test("illegal user attempt to delete post, return status(403)", async () => {
    const post = {
      UserId: 2,
    };
    Post.findOne.mockReturnValue(Promise.resolve(post));
    await deletePost(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({
      message: "illegal user attempt to delete post",
    });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    Post.findOne.mockReturnValue(Promise.reject(error));
    await deletePost(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
describe("getPosts", () => {
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
  test("Get Posts information, return status(200)", async () => {
    const posts = [];
    Post.findAll.mockReturnValue(Promise.resolve(posts));
    await getPosts(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true, data: posts });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    Post.findAll.mockReturnValue(Promise.reject(error));
    await getPosts(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
describe("getDetailPost", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("Get detail information in post, return status(200)", async () => {
    const post = {
      User: { id: 1 },
      setDataValue: jest.fn(),
      LikeUsers: [],
      files: '["hello"]',
      Comments: { length: 1 },
    };
    Post.findOne.mockReturnValue(Promise.resolve(post));
    await getDetailPost(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true, data: post });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    Post.findOne.mockReturnValue(Promise.reject(error));
    await getDetailPost(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("uploadPost", () => {
  const req = {
    user: {
      id: 1,
    },
    body: {
      caption: "This is post",
      file: "www.naver.com",
      tags: null,
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("Update profile, return status(201)", async () => {
    const post = {
      files: '["hello"]',
      setDataValue: jest.fn(),
    };
    Post.create.mockReturnValue(Promise.resolve({ id: 1 }));
    Post.findOne.mockReturnValue(Promise.resolve(post));
    await uploadPost(req, res, next);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({ success: true, data: post });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    Post.create.mockReturnValue(Promise.reject(error));
    await uploadPost(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe("uploadComment", () => {
  const req = {
    user: {
      id: 1,
      avatar: "yb",
      username: "tung",
    },
    body: {
      text: "This is comment",
    },
    params: { id: 1 },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  test("Update profile, return status(201)", async () => {
    const comment = {
      setDataValue: jest.fn(),
    };
    Comment.create.mockReturnValue(Promise.resolve(comment));
    await uploadComment(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true, data: comment });
  });

  test("if error in db, return error", async () => {
    const error = "db error";
    Comment.create.mockReturnValue(Promise.reject(error));
    await uploadComment(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
