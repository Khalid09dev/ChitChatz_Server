import express from 'express';
import { createServer } from 'node:http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';

const port = process.env.PORT || 3000;
dotenv.config();

// Express setup goes here
const app = express();
const server = createServer(app);

app.use(express.json()); 
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// })

server.listen(port, () => {
    connectToMongoDB();
    console.log(`server is running on port ${port}`);
})
