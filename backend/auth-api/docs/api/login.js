module.exports = {
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login",
      description: "Login (email, password)",
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
