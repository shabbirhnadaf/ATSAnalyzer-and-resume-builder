import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;
const start = async() => {
    await connectDB();

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

start();