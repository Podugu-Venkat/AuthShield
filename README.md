# 🛠️ Fullstack Authentication System

A complete authentication system with email verification, password reset, protected routes, and a user dashboard. Built using Node.js for the backend and a modern frontend framework.

---

## 🔧 Setup

 Clone this repository:
 
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   
Install dependencies:

npm install

Setup .env file:

MONGO_URI=your_mongo_uri
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
MAILTRAP_TOKEN=your_mailtrap_token
MAILTRAP_ENDPOINT=https://send.api.mailtrap.io/
CLIENT_URL=http://localhost:5173


🗄️ Database Setup
MongoDB is used as the database.

Make sure your MONGO_URI is correctly configured in the .env file.

🔐 Authentication Endpoints
📧 Signup
Endpoint: POST /api/auth/signup

Sends a verification email to the user.

🔍 Verify Email
Endpoint: GET /api/auth/verify/:token

Verifies the email address using the token sent.

🔑 Login
Endpoint: POST /api/auth/login

🚪 Logout
Endpoint: POST /api/auth/logout

🔄 Forgot Password
Endpoint: POST /api/auth/forgot-password

Sends a password reset link to the user’s email.

🔁 Reset Password
Endpoint: POST /api/auth/reset-password/:token

✔️ Check Auth
Endpoint: GET /api/auth/check

Checks if the user's token is still valid.
