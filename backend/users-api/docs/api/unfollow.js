module.exports = {
  "/users/{userId}/unfollow": {
    get: {
      tags: ["User"],
      summary: "Remove following",
      description: "Remove user (userId) in my following list",
      parameters: [
        {
          in: "path",
          name: "userId",
          type: "integer",
          required: true,
          description: "Numeric Id of the user",
        },
      ],
      responses: {
        201: {
          description: "Remove following",
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
                },
              },
            },
          },
        },
      },
    },
  },
};
