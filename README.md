# PaymentWalletApplication

## Project Overview
PaymentWalletApplication is a full-stack payment wallet system that enables users to register, authenticate, manage their wallet balance, send and receive money, and view transaction history. The backend is built with Spring Boot and MongoDB, while the frontend is a React application using Vite for fast development and build.

## Features
- User registration and authentication (password and OTP-based login)
- Wallet management with balance tracking
- Send and receive money with OTP verification
- Transaction history and notifications
- Responsive UI supporting desktop and mobile layouts
- Email notifications via SMTP and SMS via Twilio integration

## Technologies Used
- Backend: Java 17, Spring Boot 3.2.5, MongoDB, Twilio SDK, Spring Security, Spring Mail
- Frontend: React 18, Vite, React Router, Tailwind CSS
- Build Tools: Maven (backend), npm/yarn (frontend)

## Backend Setup

### Prerequisites
- Java 17 or higher installed
- Maven installed
- MongoDB instance (cloud or local)
- SMTP email account for sending emails (e.g., Gmail SMTP)
- Twilio account for SMS services

### Configuration
The backend configuration is located in `src/main/resources/application.yaml`. You need to provide the following environment-specific values:

- MongoDB URI with credentials
- SMTP email host, port, username, and password
- Twilio Account SID, Auth Token, and phone number
- Server port (default is 8080)

Example snippet from `application.yaml`:
```yaml
spring:
  data:
    mongodb:
      uri: mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-email-password
twilio:
  account:
    sid: your-twilio-account-sid
  auth:
    token: your-twilio-auth-token
  phone:
    number: your-twilio-phone-number
server:
  port: 8080
```

### Build and Run
To build and run the backend server:

```bash
# Build the project
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

The backend server will start on the configured port (default 8080).

## Frontend Setup

### Prerequisites
- Node.js (version 16 or higher recommended)
- npm or yarn package manager

### Install Dependencies
Navigate to the `clientSide` directory and install dependencies:

```bash
cd clientSide
npm install
# or
yarn install
```

### Run the Development Server
Start the frontend development server with hot module replacement:

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:5173` (default Vite port).

## Environment Variables and Configuration
- Backend environment variables are configured in `application.yaml`.
- Frontend environment variables (if any) can be configured in `.env` files inside `clientSide` directory (not included by default).

## API Overview

### User APIs (`/user`)
- `POST /user/save-user`: Register a new user
- `POST /user/login-password`: Login with email/mobile and password
- `POST /user/send-login-otp`: Send OTP for login
- `POST /user/login-otp`: Login with OTP
- `POST /user/send-reset-otp`: Send OTP for password reset
- `POST /user/reset-password`: Reset password with OTP
- `GET /user/{userId}`: Get user details by ID
- `GET /user/all`: Get all users (for contacts)

### Wallet APIs (`/wallet`)
- `GET /wallet/balance/{userId}`: Get wallet balance
- `GET /wallet/transactions/{userId}`: Get user transactions
- `POST /wallet/send-transaction-otp`: Send OTP for transaction
- `POST /wallet/send-with-otp`: Send money with OTP verification
- `POST /wallet/add-money-with-otp`: Add money with OTP verification
- `POST /wallet/send`: Send money 
- `POST /wallet/add-money`: Add money 
- `POST /wallet/create/{userId}`: Create wallet for user

## Testing
Backend tests are located under `src/test/java/com/payment/wallet/PaymentWallet/`. You can run tests using Maven:

```bash
mvn test
```

Frontend testing setup is not included by default.

## Contact and Support
For issues or questions, please contact the project maintainer.

---

This README provides a comprehensive overview and setup instructions for the PaymentWalletApplication project.
