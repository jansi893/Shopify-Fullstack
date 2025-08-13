import { createClient } from "redis";

console.log("🔍 REDIS_URL from .env:", process.env.REDIS_URL);

const redisClient = createClient({
  username: 'default',
  password: 'Yq2OwSGbqzmVe2c7w2KL29fWFTdB8NLd',
  socket: {
    host: 'redis-10277.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 10277,
  }
});

redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("✅ Redis Cloud connected");
  }
};

export { redisClient, connectRedis };
