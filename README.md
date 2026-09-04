
# Universal Auth & User Management API

A production-grade backend API built to power modern frontend clients—whether mobile apps (React Native, Flutter) or web applications (Next.js, React, Vue). It features robust JWT authentication, OTP verification, and complete user lifecycle management.

## 🚀 Tech Stack

- **Runtime & Framework:** Node.js (ESM), Express.js
- **Language:** TypeScript
- **Database & ORM:** PostgreSQL, Drizzle ORM
- **Validation:** Zod
- **Security:** Argon2 (password hashing), JWT (JSON Web Tokens)
- **Documentation:** Swagger UI
- **Email Delivery:** Nodemailer (with Ethereal support for local sandbox testing)

---

## 📁 Project Structure

```text
├── docs/                 # OpenAPI Documentation (Multi-file YAML setup)
│   ├── openapi.yaml      # Master configuration & global tags
│   └── paths/            # Domain-specific route definitions
│       ├── auth.yaml     # Authentication routes (register, login, otp)
│       └── users.yaml    # User resource routes (/me management)
├── src/
│   ├── controllers/      # Feature-specific business logic
│   ├── db/               # Database configuration & Drizzle schemas
│   ├── middlewares/      # Reusable middlewares (e.g., JWT authentication)
│   ├── routes/           # Express router declarations
│   ├── services/         # Cross-cutting services (e.g., email dispatching)
│   ├── utils/            # Helper functions (e.g., standardized JSON responses)
│   └── index.ts          # Application entry point
├── package.json
└── tsconfig.json

```

---

## 🛠️ Prerequisites

Ensure you have the following installed on your system before proceeding:

* **Node.js** (v18+ recommended)
* **pnpm** (or npm / yarn)
* A running **PostgreSQL** database instance

---

## 📦 Installation & Setup

1. **Clone the repository and install dependencies:**
```bash
git clone <repository-url>
cd project-directory
pnpm install

```


2. **Configure environment variables:**
Create a `.env` file at the root of the project using the following template:
```env
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/database_name
JWT_SECRET=your_super_secure_jwt_secret

```


3. **Initialize the database:**
Run Drizzle migrations/push to set up your database schema:
```bash
pnpm drizzle-kit push

```



---

## 🏃‍♂️ Running the Application

* **Development mode (with hot-reloading):**
```bash
pnpm dev

```


The server will start up on **`http://localhost:3000`**.

---

## 📚 API Documentation (Swagger)

This API is comprehensively documented using interactive **Swagger UI**, powered by a modular multi-file YAML setup.

Once your server is running, open your browser and navigate to:
👉 **`http://localhost:3000/api-docs`**

> **Note:** To test protected endpoints (such as deleting a user account via `/api/users/me`), first authenticate using the login endpoint to retrieve your JWT token, then click the **Authorize** button at the top of the Swagger UI interface to apply it.

```

```