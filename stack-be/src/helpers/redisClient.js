const redis = require("redis");
const redisClient = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD
});
const redisStart = async () => {
	await redisClient.connect();
};
redisClient.on("error", err => console.log("Redis Client Error", err));
redisStart();
module.exports = redisClient;
