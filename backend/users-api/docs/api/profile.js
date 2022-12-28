module.exports = {
  "/users": {
    get: {
      tags: ["User"],
      summary: "Recommand new friend",
      description: "Recommand new friend for following",
      responses: {
        200: {
          description: "Success on get information",
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
                    description: "user information",
                    example: [
                      {
                        id: 2,
                        fullname: "YeongbinHwang",
                        username: "yeongbin",
                        avatar: "www.naver.com",
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
    put: {
      tags: ["User"],
      summary: "Update user information",
      description:
        "Update user information (fullname, username, website, bio, avatar)",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              properties: {
                fullname: {
                  type: "string",
                  description: "fullname",
                  example: "Yeongbin Hwang",
                },
                username: {
                  type: "string",
                  description: "social id",
                  example: "tungtungbin",
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
