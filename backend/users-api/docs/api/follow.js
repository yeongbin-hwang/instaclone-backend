module.exports = {
  "/users/{userId}/follow": {
    get: {
      tags: ["User"],
      summary: "Add following",
      description: "Add user (userId) to following list",
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
          description: "Add following",
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
