module.exports = {
  "/users/feed": {
    get: {
      tags: ["User"],
      summary: "Get all feeds",
      description: "Get all feeds that uploaded by the user I followed",
      responses: {
        200: {
          description: "Add following",
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
  },
};
