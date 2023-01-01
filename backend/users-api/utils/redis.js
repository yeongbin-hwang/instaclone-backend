const redis = require("redis");

const redisClient = redis.createClient({
  url: `redis://default@${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
});

redisClient.on("connect", () => {
  console.log("Redis connected!");
});
redisClient.on("error", (err) => {
  console.log("redis client error", err);
});
redisClient.connect().then();

module.exports = redisClient;
