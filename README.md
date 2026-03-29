# 💰 FinTrack - Full Stack Expense Manager

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

A production-ready financial tracking application designed to help users efficiently manage and visualize their expenses. Built from the ground up to demonstrate a complete full-stack architecture, including secure JWT authentication, RESTful API design, and interactive charting.

## 🚀 Features

- **Secure Authentication**: Robust user registration and login flow utilizing JSON Web Tokens (JWT) with automatic token refresh capabilities.
- **Expense Management (CRUD)**: Create, read, update, and delete expenses. Categorize spending into intuitive buckets (e.g., Food, Travel, Bills).
- **Data Visualization**: Real-time Interactive Pie and Bar charts built with Chart.js to breakdown financial data visually.
- **Optimized UI/UX**: Fully responsive, mobile-friendly interface featuring private routes, summary dashboards, and smooth navigation.
- **Data Isolation**: Enterprise-level data security ensuring users only have access to their own financial records.

## 🛠️ Tech Stack

**Frontend**
- **React.js 19**: Component-based UI formulation.
- **React Router DOM**: Client-side routing for seamless transitions.
- **Axios**: HTTP client equipped with interceptors for global state and token management.
- **Chart.js & React-Chartjs-2**: Dynamic data visualization.

**Backend**
- **Python / Django 6.0**: Core backend framework handling ORM and routing.
- **Django REST Framework (DRF)**: API construction and serialization.
- **SimpleJWT**: Secure REST API token issuing.
- **MySQL**: Relational database for production-grade data storage.

## ⚙️ Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js & npm
- MySQL Server

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/JAYASHANKAR-K-S/Expense_Tracker_Fullstack.git
cd Expense_Tracker_Fullstack/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `.\venv\Scripts\activate`

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the Django development server
python manage.py runserver
```

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to the frontend directory
cd Expense_Tracker_Fullstack/frontend

# Install Node dependencies
npm install

# Start the React development server
npm start
```
*The application will automatically launch at `http://localhost:3000`.*

## 🔌 API Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register/` | Register new user | ❌ |
| **POST** | `/auth/login/` | Get Access/Refresh Tokens | ❌ |
| **POST** | `/auth/token/refresh/` | Refresh Access Token | ❌ |
| **GET** | `/api/expenses/` | List all expenses | ✅ |
| **POST** | `/api/expenses/` | Create new expense | ✅ |
| **GET** | `/api/categories/` | List all categories | ✅ |

## 👨‍💻 Author

Built and maintained by **Jayashankar K S**.
