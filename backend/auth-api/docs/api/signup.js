module.exports = {
  "/auth/signup": {
    post: {
      tags: ["Auth"],
      summary: "Signup",
      description: "Signup (email, password)",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              properties: {
                email: {
                  type: "string",
                  description: "email",
                  example: "kyh3565800@kaist.ac.kr",
                },
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
                password: {
                  type: "string",
                  description: "password",
                  example: "tungtungbin",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
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
                    type: "string",
                    description: "jwt token",
                    example: "jwt token",
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
