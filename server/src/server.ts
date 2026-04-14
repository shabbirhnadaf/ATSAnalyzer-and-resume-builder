import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;
const start = async() => {
    await connectDB();
    console.log("API KEY:", process.env.GEMINI_API_KEY);

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

start();