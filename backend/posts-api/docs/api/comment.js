module.exports = {
  "/posts/{postId}/comments": {
    post: {
      tags: ["Post"],
      summary: "Toggle Save",
      description: "Toggle Save button in the post",
      parameters: [
        {
          in: "path",
          name: "postId",
          type: "integer",
          required: true,
          description: "Numeric Id of the post",
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              properties: {
                text: {
                  type: "string",
                  description: "text",
                  example: "This is my comment",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Success on toggle Save",
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
                      text: {
                        type: "string",
                        description: "text",
                        example: "This is my comment",
                      },
                      username: {
                        type: "string",
                        description: "user social id in SNS",
                        example: "tungbin",
                      },
                      avatar: {
                        type: "string",
                        description: "avatar url",
                        example:
                          "https://res.cloudinary.com/dz5alijky/image/upload/v1660927636/default-user-icon-13_hpland.png",
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
