# 🐉 DragonStore Backend

A robust and scalable E-commerce RESTful API built with **Node.js** and **Express**. This project serves as the backend for the DragonStore platform, providing secure user authentication, product management, and order processing workflows.

---

## 🚀 Key Features

*   **User Authentication**: Secure sign-up and login using **JWT** (JSON Web Tokens) and **Bcrypt** for password hashing.
*   **Product Management**: Full CRUD operations for products, including categorization and inventory tracking.
*   **Category System**: Dynamic management of product categories and sub-categories.
*   **Order Management**: Complete lifecycle for customer orders, from creation to status tracking.
*   **Security & Validation**: Centralized middleware for request validation, error handling, and route protection.
*   **Database Integration**: Optimized data modeling using **Mongoose** for MongoDB interactions.

---

## 🛠️ Tech Stack

*   **Runtime**: Node.js[cite: 1]
*   **Framework**: Express.js[cite: 1]
*   **Database**: MongoDB[cite: 1]
*   **ODM**: Mongoose
*   **Security**: JWT, Bcrypt
*   **Environment**: Dotenv for secure configuration management

---

## 🏗️ Project Structure
```text
DragonStore-Back-end/
├── controllers/    # Business logic for each route
├── models/         # Mongoose schemas and database logic
├── routes/         # API endpoint definitions
├── middlewares/    # Auth, error handling, and validation
├── utils/          # Helper functions and utilities
├── .env            # Environment variables (not tracked)
└── server.js       # Application entry point


# For production
    npm start

    # For development (with nodemon)
    npm run dev
    ```

---

## 👨‍💻 Author

**Abdalazim Ahmed Abdalazim Thabet**[cite: 1]
*   **Software Engineer** | Cairo, Egypt[cite: 1]
*   **B.Sc. in Computer Science** with Honors | Sohag University[cite: 1]
*   **Codeforces Expert** | [cite: 1]
*   **ICPC Regionalist** & Mentor[cite: 1]
