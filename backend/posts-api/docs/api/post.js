module.exports = {
  "/posts": {
    get: {
      tags: ["Post"],
      summary: "Get posts' information",
      description: "Get posts' information",
      responses: {
        200: {
          description: "Success on get posts' information",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "bool",
                    description: "success or not",
                    example: true,
                  },
                  data: {
                    type: "array",
                    description: "posts information",
                    example: [
                      {
                        id: 2,
                        caption: "Hello",
                        files: ["www.naver.com"],
                        UserId: 3,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Post"],
      summary: "Update user information",
      description:
        "Update user information (fullname, username, website, bio, avatar)",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              properties: {
                caption: {
                  type: "string",
                  description: "caption",
                  example: "This is my post",
                },
                files: {
                  type: "array",
                  description: "uploaded files",
                  example: ["file's url"],
                },
                tags: {
                  type: "string",
                  description: "tag",
                  example: "#hungry",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "bool",
                    description: "success or not",
                    example: true,
                  },
                  data: {
                    type: "object",
                    properties: {
                      caption: {
                        type: "string",
                        description: "caption",
                        example: "This is my post",
                      },
                      files: {
                        type: "array",
                        description: "uploaded files",
                        example: ["file's url"],
                      },
                      tags: {
                        type: "string",
                        description: "tag",
                        example: "#hungry",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
