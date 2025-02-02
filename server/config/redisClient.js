const redis = require("redis");

const client = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-19825.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 19825
    }
});

const connectRedis = async () => {
    try {
        await client.connect();
        console.log("Redis Client Connected Successfully");
    } catch (err) {
        console.error("Redis Connection Error:", err);
    }
};

// Immediately invoke the function to connect Redis
connectRedis();

module.exports = client;

