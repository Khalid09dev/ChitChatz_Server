import express from 'express';
import { createServer } from 'node:http';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';

const port = process.env.PORT || 3000;
dotenv.config();

// Express setup goes here
const app = express();
const server = createServer(app);

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.use('/api/auth', authRoutes);
server.listen(port, () => {
    console.log(`server is running on port ${port}`);
})