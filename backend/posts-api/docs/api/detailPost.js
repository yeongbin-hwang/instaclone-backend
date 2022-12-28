module.exports = {
  "/posts/{postId}": {
    get: {
      tags: ["Post"],
      summary: "Get detail post information",
      description: "Get detail post information",
      parameters: [
        {
          in: "path",
          name: "postId",
          type: "integer",
          required: true,
          description: "Numeric Id of the post",
        },
      ],
      responses: {
        200: {
          description: "Success on get detail post information",
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
                        description: "tags",
                        example: "#hungry",
                      },
                      comments: {
                        type: "string",
                        description: "comments",
                        example: "This is my comment",
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
    post: {
      tags: ["Post"],
      summary: "Update post information",
      description: "Update post information (caption, tags, files)",
      parameters: [
        {
          in: "path",
          name: "postId",
          type: "string",
          required: true,
          description: "Numeric Id of the post",
        },
      ],
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
                  description: "tags",
                  example: "#hungry",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Updated post successfully",
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
                        description: "tags",
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
    delete: {
      tags: ["Post"],
      summary: "Delete post",
      description: "Delete post (postId)",
      parameters: [
        {
          in: "path",
          name: "postId",
          type: "string",
          required: true,
          description: "Numeric Id of the post",
        },
      ],
      responses: {
        201: {
          description: "Updated post successfully",
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
                        description: "tags",
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
