# 💰 Full Stack Expense Tracker - A to Z Guide

Welcome to the **Ultimate Guide** for the Expense Tracker. This document explains **everything** used in this project, why it's used, how the code is structured, and how to run it.

---

## 🏗️ Architecture Overview

This is a **Decoupled Monorepo**, meaning we have two distinct applications in one folder:
1.  **Backend (`/backend`)**: The "Brain". Written in Python (Django). It talks to the database and provides data via API.
2.  **Frontend (`/frontend`)**: The "Face". Written in JavaScript (React). It runs in the user's browser and fetches data from the backend.

**Data Flow**:
`React (Frontend)` ↔️ `Axios (HTTP Requests)` ↔️ `Django (Backend)` ↔️ `Database (MySQL/SQLite)`

---

## �️ Backend (The Engine)

Located in: `backend/`
Framework: **Django 6.0** + **Django REST Framework (DRF)**

### **Key Dependencies & Why We Use Them**
| Library | Purpose |
| :--- | :--- |
| `Django` | High-level Python web framework. Handles URL routing, database interaction (ORM), and security. |
| `djangorestframework` | Toolkit to build Web APIs. Turns database models into JSON data. |
| `djangorestframework_simplejwt` | Handles **Authentication**. Issues access/refresh tokens so users stay logged in securely. |
| `django-cors-headers` | Security middleware. Allows the Frontend (port 3000) to talk to the Backend (port 8000). |
| `gunicorn` | Production web server (WSGI) used when deploying to the cloud. |
| `whitenoise` | Serves static files (CSS, Images) efficiently in production. |
| `mysqlclient` | Driver to connect Django to a MySQL database (used in production). |

### **Project Structure (Backend)**
*   `manage.py`: The command-center script. Used to run the server, make migrations, etc.
*   `config/`: Main configuration folder.
    *   `settings.py`: Controls everything (Database URL, Installed Apps, Security Keys).
    *   `urls.py`: The "Table of Contents" for API routes.
*   `expenses/`: The main "App" containing business logic.
    *   `models.py`: Defines the database tables (`Expense`, `Goal`, `Wallet`).
    *   `views.py`: The logic. Decides what data to send back when a specific URL is hit.
    *   `serializers.py`: Translates Python Objects (Models) -> JSON (for React).

---

## 🎨 Frontend (The User Interface)

Located in: `frontend/`
Library: **React 19**

### **Key Dependencies & Why We Use Them**
| Library | Purpose |
| :--- | :--- |
| `react`, `react-dom` | Core library for building Component-based UI. |
| `react-router-dom` | Handles navigation (e.g., switching from Dashboard to Login) without reloading the page. |
| `axios` | The messenger. Sends requests (GET, POST) to the Backend API. |
| `chart.js`, `react-chartjs-2` | Renders beautiful interactive charts (Pie, Bar) for financial data. |
| `jwt-decode` | Decodes the JWT token to know *who* is logged in (User ID, Expiry time). |
| `framer-motion` | Adds smooth animations to the UI. |
| `react-icons` | Provides icon packs (FaUser, FaMoneyBill) for a polished look. |

### **Project Structure (Frontend)**
*   `public/`: Static files (HTML, favicon).
*   `src/`: Source code.
    *   `index.js`: The entry point. Mounts the React App to the HTML.
    *   `App.js`: The main container. Sets up Routes (Dashboard, Login).
    *   `context/ThemeContext.js`: Manages Global State (e.g., Dark Mode) so it persists across pages.
    *   `components/`: Reusable building blocks (Navbar, Layout, PrivateRoute).
    *   `pages/`: Full-page views (`Dashboard.js`, `Register.js`).
    *   `api/`: Configuration for Axios (Base URL, Interceptors).

---

## � How to Run (Step-by-Step)

You need **Two Terminals** open—one for the backend, one for the frontend.

### **Phase 1: Database & Backend**

1.  **Open Terminal 1** and go to the backend folder:
    ```bash
    cd backend
    ```
2.  **(Optional) Create Virtual Environment**:
    Usually, you want to isolate dependencies.
    ```bash
    python -m venv venv
    ```
3.  **Activate Environment**:
    *   Windows: `.\venv\Scripts\Activate`
    *   Mac/Linux: `source venv/bin/activate`
4.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
5.  **Setup Database**:
    This creates the tables in SQLite (default for development).
    ```bash
    python manage.py migrate
    ```
6.  **Start Server**:
    ```bash
    python manage.py runserver
    ```
    ✅ **Success**: You will see "Starting development server at http://127.0.0.1:8000/"

### **Phase 2: Frontend**

1.  **Open Terminal 2** and go to the frontend folder:
    ```bash
    cd frontend
    ```
2.  **Install Node Modules**:
    Downloads all the libraries listed above.
    ```bash
    npm install
    ```
3.  **Start React App**:
    ```bash
    npm start
    ```
    ✅ **Success**: The browser will open http://localhost:3000 automatically.

---

## �️ Security Features
1.  **Private Routes**: If you try to go to `/dashboard` without logging in, `PrivateRoute.js` checks for a token. If missing, it kicks you to `/login`.
2.  **Token Refresh**: Access tokens expire quickly (security best practice). Axios Interceptors automatically use the Refresh Token to get a new Access Token without the user noticing.
3.  **Data Isolation**: The Backend checks `request.user` on evey request. You can NEVER see another user's expenses.

---

## ❓ FAQ
**Q: Why do I see a CORS error?**
A: This happens if the Backend doesn't know the Frontend's URL. We use `django-cors-headers` and set `CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]` in settings.py to fix this.

**Q: Can I run this on mobile?**
A: Yes! The CSS is responsive. You can access it via your computer's IP address (e.g. `192.168.1.5:3000`) if your phone is on the same WiFi.
