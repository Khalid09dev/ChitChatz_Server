# Chat Application Backend

## Overview

This repository contains the backend code for a chat application. It includes an Express server configured with Socket.IO for real-time communication, along with user management and chat functionalities. The server supports CORS to allow interactions with a frontend running on a different port during development.

## Features

- **Real-time Messaging**: Use Socket.IO for real-time communication between clients.
- **User Management**: Manage user connections and disconnections.
- **CORS Configuration**: Allows requests from the specified frontend origin.
- **Socket ID Management**: Keep track of connected users using their socket IDs.

## Installation

1. **Clone the Repository**:
    ```bash
    git clone <https://github.com/Khalid09dev/ChitChatz_Server.git>
    cd <ChitChatz-Server>
    ```

2. **Install Dependencies**:
    Ensure you have Node.js installed. Then, install the required packages:
    ```bash
    npm install
    ```

3. **Environment Variables**:
    Create a `.env` file in the root directory of the project and add the following environment variables:
    ```plaintext
    MONGO_DB_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    ```

## Usage

1. **Start the Server**:
    Run the following command to start the server:
    ```bash
    npm start
    ```
    The server will start on port `3000` by default.

2. **Socket.IO Setup**:
    - **Connection**: Connect to the server using Socket.IO from your frontend application. Ensure the client connects to the correct port.
    - **Events**: Use events like `'connection'`, `'disconnect'`, and custom events for real-time messaging.

## API Endpoints

- **GET /api/users**: Retrieve a list of users (excluding the logged-in user).
- **POST /api/login**: Log in a user.
- **POST /api/signup**: Register a new user.
- **POST /api/logout**: Log out the current user.
- **GET /api/messages/:id**: Get messages for a conversation with the specified user ID.
- **POST /api/messages/:id**: Send a new message to the specified user ID.

## Configuration

- **CORS Configuration**: Adjust the CORS settings in `app.use(cors({ ... }))` to match your frontend's origin.
- **Socket.IO Configuration**: Modify the Socket.IO settings in `new Server(server, { ... })` as needed.