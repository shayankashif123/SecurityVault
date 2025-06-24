# SecurityVault 🔐
Your Secure Password Manager Platform – built with modern web technologies to keep your sensitive data safe.

## 🚀 Overview
**SecurityVault** is a zero-trust password manager built with **Next.js**, **NextAuth**, **MongoDB**, and **Nodemailer**. It allows users to securely store and manage their credentials for various applications. Security is the highest priority, featuring email confirmation, AES-256 encryption, and strict access control.

---

## ✨ Features

- 🌐 Built using **Next.js App Router** for rapid and scalable development
- 🔐 **Custom authentication** system using NextAuth
- 📧 Email verification with OTP sent via **Nodemailer**
- 🔑 **AES-256 encrypted** passwords for secure storage
- 🧾 User-specific password vault (data is linked via `userId` from MongoDB)
- 👁️‍🗨️ Toggle visibility for stored passwords in the UI
- 🛡️ Protected API routes using **Next.js Middleware**
- 📦 Clean, attractive, and responsive user interface
- 🧰 Fully encrypted database entries – even if breached, raw passwords stay hidden

---

## 🛠️ Tech Stack

| Technology  | Purpose                     |
|-------------|-----------------------------|
| Next.js     | Frontend & API Routes       |
| NextAuth    | Authentication              |
| MongoDB     | Database                    |
| Mongoose    | ODM for MongoDB             |
| Nodemailer  | Sending OTP confirmation    |
| Bcrypt & AES| Encryption and Security     |
| Tailwind CSS| UI Styling                  |

---

## 🔐 Security Highlights

- **Password Encryption**: Passwords are stored using **AES-256 encryption**.
- **Email Verification**: Users receive an OTP code to verify email before activating accounts.
- **Middleware Protection**: All sensitive routes are protected via **Next.js middleware**.
- **Isolated User Data**: Passwords are stored under `userId` to ensure no user can access another's data.

### 🔐 Sample Encrypted Password Entry

```json
{
  "_id": "685956715823c3a97de9684f",
  "userId": "68220ee61f1df3cf64b251f8",
  "app": "facebook",
  "username": "shayanfarooqui789@gmail.com",
  "password": "e864c5eb6ef0c0a55bae5edae537fac0:3b5501240b6be871808bcb40b54fc621", // AES-256
  "__v": 0
}
