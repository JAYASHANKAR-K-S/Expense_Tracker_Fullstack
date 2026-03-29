# 💰 Full Stack Expense Tracker

A production-ready financial tracking application built with **Django (Backend)** and **React.js (Frontend)**. This project demonstrates full-stack development capability, including secure authentication, RESTful APIs, interactive data visualization, and database management.

---

## 🚀 Tech Stack

### **Backend**
*   **Framework**: Django, Django REST Framework (DRF)
*   **Database**: MySQL (Production), SQLite (Dev)
*   **Authentication**: JWT (JSON Web Tokens) with `simplejwt`
*   **Optimization**: Django-Cors-Headers, WhiteNoise
*   **Security**: Password hashing, protected API endpoints

### **Frontend**
*   **Library**: React.js (Hooks, Functional Components)
*   **Routing**: React Router DOM (Protected Routes)
*   **HTTP Client**: Axios (with Interceptors for Auto-Refresh)
*   **Visualization**: Chart.js, React-Chartjs-2
*   **Styling**: CSS3 (Responsive Design)

---

## ✨ Features

1.  **Secure Authentication**:
    *   User Registration & Login.
    *   JWT-based session management (Access & Refresh Tokens).
    *   Automatic token refreshing via Axios Interceptors.
2.  **Expense Management**:
    *   Create, Read, Update, Delete (CRUD) expenses.
    *   Categorize expenses (Food, Travel, Bills, etc.).
3.  **Data Visualization**:
    *   **Pie Chart**: Breakdown of spending by category.
    *   **Bar Chart**: Overview of financial data.
4.  **Optimized UI**:
    *   Dashboard with summary cards.
    *   Responsive navigation bar.
    *   Private Routes (redirects unauthenticated users).

---

## 🛠️ Setup Instructions

### **Prerequisites**
*   Python 3.10+
*   Node.js & npm
*   MySQL Server

### **1. Backend Setup**
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
# Activate (Windows)
./venv/Scripts/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Database credentials (if needed)
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### **2. Frontend Setup**
```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Run React App
npm start
```
*Access the app at `http://localhost:3000`*

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register/` | Register new user | ❌ |
| **POST** | `/auth/login/` | Get Access/Refresh Tokens | ❌ |
| **POST** | `/auth/token/refresh/` | Refresh Access Token | ❌ |
| **GET** | `/api/expenses/` | List all expenses | ✅ |
| **POST** | `/api/expenses/` | Create new expense | ✅ |
| **GET** | `/api/categories/` | List all categories | ✅ |

---

## 👨‍💻 Interview Questions & answers

**Q: Why did you use JWT instead of Session Auth?**
*   **A:** JWT is stateless and scalable. It allows the frontend (React) and backend (Django) to be completely separate domains, making it easier to deploy them independently or even build a mobile app later using the same API.

**Q: How do you handle security?**
*   **A:** Passwords are hashed by Django. API endpoints are protected using DRF permissions (`IsAuthenticated`). CORS is configured to only allow requests from trusted origins.

**Q: How does the chart work?**
*   **A:** I used `reduce()` in JavaScript to aggregate the flat list of expenses by category, effectively grouping and summing them up on the client side before passing the data to `Chart.js`.

---

## 📄 License
This project is for educational purposes.
