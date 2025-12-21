import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use("/api/v1", chatRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log((`Chat Service Server is running on PORT ${PORT} `));
})

export default app;