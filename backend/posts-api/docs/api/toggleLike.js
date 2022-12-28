module.exports = {
  "/posts/{postId}/toggleLike": {
    get: {
      tags: ["Post"],
      summary: "Toggle Like",
      description: "Toggle Like button in the post",
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
          description: "Success on toggle like",
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
