# User Management System with Weather Integration

## Overview

The User Management System with Weather Integration provides functionalities for user registration, authentication, password management, and search history, while integrating with a weather API to manage weather data. The system is built with Node.js and Express, utilizing MongoDB for database operations and environment variables for configuration.

## Features

- **User Registration:** Create new user accounts with validation.
- **User Login:** Authenticate users and issue JWT tokens.
- **Password Management:** Reset passwords and verify reset tokens via email.
- **Search History:** Record and retrieve user search queries.
- **Dashboard Data:** Retrieve user-specific dashboard data.

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- MongoDB
- An email service (for password reset functionality)
- OpenWeatherMap API key (if integrating weather features)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/user-management-system.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd user-management-system
    ```

3. **Install the dependencies:**

    ```bash
    npm install
    ```

4. **Configure environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=5500
    NODE_ENV=development
    APP_VERSION=1.0.0
    DB_URI=mongodb://localhost:27017/user-management
    JWT_SECRET=your_jwt_secret
    EMAIL_SERVICE=your_email_service
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    SESSION_SECRET=your_session_secret
    ```

5. **Run the application:**

    ```bash
    npm start
    ```

    The application will be running at `http://localhost:5500`.

## API Endpoints

### User Registration

- **Endpoint:** `POST /api/register`
- **Description:** Registers a new user with validation.
- **Request Body:**

    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "city": "string",
      "password": "string"
    }
    ```

- **Responses:**

    - **Success:**

        ```json
        {
          "status": "success",
          "message": "User registered successfully."
        }
        ```

    - **Error:**

        ```json
        {
          "status": "error",
          "message": "Error message"
        }
        ```

### User Login

- **Endpoint:** `POST /api/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**

    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

- **Responses:**

    - **Success:**

        ```json
        {
          "status": "success",
          "token": "jwt_token"
        }
        ```

    - **Error:**

        ```json
        {
          "status": "error",
          "message": "Invalid credentials"
        }
        ```

### Forgot Password

- **Endpoint:** `POST /api/forgot-password`
- **Description:** Sends a password reset token to the user's email.
- **Request Body:**

    ```json
    {
      "email": "string"
    }
    ```

- **Responses:**

    - **Success:**

        ```json
        {
          "status": "success",
          "message": "Password reset token sent."
        }
        ```

    - **Error:**

        ```json
        {
          "status": "error",
          "message": "Error message"
        }
        ```

### Verify Reset Password Token

- **Endpoint:** `GET /api/verify-reset-password-token`
- **Description:** Verifies the reset password token.
- **Query Parameters:**

    ```json
    {
      "token": "string"
    }
    ```

- **Responses:**

    - **Success:**

        ```json
        {
          "status": "success",
          "message": "Token verified."
        }
        ```

    - **Error:**

        ```json
        {
          "status": "error",
          "message": "Invalid token"
        }
        ```

### Reset Password

- **Endpoint:** `POST /api/reset-password`
- **Description:** Resets the user's password using the provided token.
- **Request Body:**

    ```json
    {
      "resetToken": "string",
      "newPassword": "string"
    }
    ```

- **Responses:**

    - **Success:**

        ```json
        {
          "status": "success",
          "message": "Password has been reset."
        }
        ```

    - **Error:**

        ```json
        {
          "status": "error",
          "message": "Error message"
        }
        ```

### Get Dashboard Data

- **Endpoint:** `GET /api/dashboard`
- **Description:** Retrieves user-specific dashboard data.
- **Responses:**

    - **Success:**

        ```json
        {
          "status": "success",
          "data": {}
        }
        ```

    - **Error:**

        ```json
        {
          "status": "error",
          "message": "Error message"
        }
        ```

### Get Search History

- **Endpoint:** `GET /api/search-history/:email`
- **Description:** Retrieves a user's search history by email.
- **Responses:**

    - **Success:**

        ```json
        {
          "status": "success",
          "data": []
        }
        ```

    - **Error:**

        ```json
        {
          "status": "error",
          "message": "Error message"
        }
        ```

### Save Search History

- **Endpoint:** `POST /api/search-history/:email`
- **Description:** Saves a search term to the user's search history.
- **Request Body:**

    ```json
    {
      "query": "string"
    }
    ```

- **Responses:**

    - **Success:**

        ```json
        {
          "status": "success",
          "message": "Search history updated."
        }
        ```

    - **Error:**

        ```json
        {
          "status": "error",
          "message": "Error message"
        }
        ```

## Middleware

### Authentication Middleware

- **Description:** Verifies JWT tokens for protected routes.
- **Responses:**

    - **Success:**

        ```json
        {
          "status": "success",
          "message": "Authentication successful."
        }
        ```

    - **Error:**

        ```json
        {
          "status": "error",
          "message": "Authentication failed."
        }
        ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please contact:

- **Email:** adeoluamole@gmail.com
- **GitHub Issues:** [GitHub Issues](https://github.com/AdeAdex/user-management-system/issues)
