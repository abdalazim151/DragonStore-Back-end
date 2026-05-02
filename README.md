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

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB
*   **ODM**: Mongoose
*   **Security**: JWT and Bcrypt
*   **Environment**: Dotenv for secure configuration management[cite: 1]

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
