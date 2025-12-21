import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createClient } from 'redis'
import userRoutes from './routes/user.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import cors from 'cors'

dotenv.config();

 connectDB();

 connectRabbitMQ();

if (!process.env.REDIS_URL) {
  throw new Error('❌ Missing REDIS_URL environment variable');
}

// ✅ Create Redis Client
export const redisClient = createClient({
  url: process.env.REDIS_URL,
});


 redisClient.connect().then(()=> console.log("Connected to Redis") ).catch((err) => {
    console.error("Redis connection failed:", err);
    process.exit(1)   
});

const app = express();
const PORT = process.env.PORT || 5000;


// app.get("/", (req, res) => {
  //   res.send("User Service is running");
  // });
app.use(cors());
app.use(express.json());
app.use('/api/v1', userRoutes);

app.listen(PORT, () => {
    console.log((`Server is running on PORT ${PORT} `));
} )