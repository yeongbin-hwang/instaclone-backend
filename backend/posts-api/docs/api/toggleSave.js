module.exports = {
  "/posts/{postId}/toggleSave": {
    get: {
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
                },
              },
            },
          },
        },
      },
    },
  },
};
