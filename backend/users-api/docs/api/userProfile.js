module.exports = {
  "/users/{username}": {
    get: {
      tags: ["User"],
      summary: "Get user's profile",
      description: "Get user's profile",
      parameters: [
        {
          in: "path",
          name: "username",
          type: "string",
          required: true,
          description: "User's nickname used in SNS",
        },
      ],
      responses: {
        200: {
          description: "User's profile",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "bool",
                    description: "success message",
                    example: true,
                  },
                  data: {
                    type: "object",
                    properties: {
                      fullname: {
                        type: "string",
                        description: "fullname",
                        example: "Yeongbin Hwang",
                      },
                      username: {
                        type: "string",
                        description: "social id",
                        example: "tungbin",
                      },
                      website: {
                        type: "string",
                        description: "website url",
                        example: "https://yeongbin.dev",
                      },
                      bio: {
                        type: "string",
                        description: "user bio",
                        example: "I'm from South Korea",
                      },
                      avatar: {
                        type: "string",
                        description: "user image url",
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
