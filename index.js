import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import bodyParser from 'body-parser';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';
import { app, server } from './socket/socket.js';

dotenv.config();
const port = process.env.PORT || 3000;

//client-side url
const clientUrl = process.env.CLIENT_URL;

// middlewares
app.use(cookieParser());
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: clientUrl, // Replace with your frontend origin
    credentials: true,
}));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
})


const startServer = async () => {
    try {
        await connectToMongoDB();
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1); // Exit with an error code
    }
};

startServer();
