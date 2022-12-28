module.exports = {
  "/auth/me": {
    get: {
      tags: ["Auth"],
      summary: "Verify token",
      description: "Verify token",
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
                      username: {
                        type: "string",
                        description: "social id",
                        example: "tungbin",
                      },
                      fullname: {
                        type: "string",
                        description: "fullname",
                        example: "Yeongbin Hwang",
                      },
                      email: {
                        type: "string",
                        description: "email",
                        example: "kyh3565800@kaist.ac.kr",
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
