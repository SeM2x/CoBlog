# CoBlog - Server Side

CoBlog is a dynamic blogging platform designed to empower users to co-write and collaborate in real-time. Whether you're sharing personal stories, experiences, or creative content, CoBlog allows multiple users to seamlessly edit a blog together, just like Google Docs. The platform's real-time collaboration features make it perfect for teams, writers, or anyone looking to share their thoughts collectively.

This repository contains the server-side code for the CoBlog application. It provides the backend functionality for managing users, handling blog posts, and facilitating real-time collaboration.

---

## Features

- **Real-Time Collaboration**: Multiple users can edit the same blog post simultaneously. Changes made by any user are immediately reflected to all other users in real-time.
- **User Authentication**: Users can create accounts, log in, and manage their profiles.
- **Blog Management**: Create, read, update, and delete blogs.
- **Version History**: Track and revert changes made to the blog posts.
- **Collaboration Invitations**: Users can invite others to join and contribute to their blog posts.
- **Role Management**: Different user roles, such as authors and editors, are supported, with varying levels of access control.
- **WebSocket Support**: Enables real-time interaction between users using WebSockets.

---

## Technologies

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express.js**: Web framework for handling HTTP requests.
- **Socket.io**: Real-time, bidirectional communication between the client and the server.
- **MongoDB**: NoSQL database for storing user data, blog posts, and other related information.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Passport.js**: Authentication middleware for handling user login and registration.
- **JSON Web Tokens (JWT)**: Token-based authentication for securing API routes.

---

## Prerequisites

Before you start, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or use MongoDB Atlas)

---

## Installation

Follow the steps below to set up and run the CoBlog server:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/coblog-server.git
   cd CoBlog/server
   ```

2. **Install dependencies:** Run the following command to install the necessary dependencies:
    ```bash
    npm install
    ```

3. **Set up environment variables:** Create a .env file in the root directory and add the following environment variables:
    ```env
    JWT_SECRET=your-secret-key
    ```

4. **Start the server:** To run the server in development mode, use the following command:

    ```bash
    npm run start-server
    ```

- Checkout [routes.md](./ROUTES.md) for all app routes.

Happy blogging! 🎉