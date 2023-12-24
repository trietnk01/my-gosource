const redis = require("redis");
const redisClient = redis.createClient({
	host: "localhost",
	port: 6379,
	password: "246357"
});
const connect = async () => {
	await redisClient.connect();
};
redisClient.on("error", err => console.log("Redis Client Error", err));
connect();
module.exports = redisClient;
