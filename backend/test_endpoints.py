import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

def p(title, data):
    print(f"\n--- {title} ---")
    print(json.dumps(data, indent=2))

def run_tests():
    # 1. Register
    reg_url = f"{BASE_URL}/auth/register/"
    user_data = {
        "username": "testuser_api",
        "email": "test@api.com",
        "password": "complexpassword123"
    }
    
    print(f"Testing Registration: {reg_url}")
    # Try to register, if user exists, ignore error for this script flow
    r = requests.post(reg_url, data=user_data)
    if r.status_code == 201:
        p("Registration Success", r.json())
    else:
        print("User probably already exists (Status: {r.status_code}), proceeding to login...")

    # 2. Login
    login_url = f"{BASE_URL}/auth/login/"
    login_data = {"username": "testuser_api", "password": "complexpassword123"}
    r = requests.post(login_url, data=login_data)
    
    if r.status_code != 200:
        print("Login Failed!")
        print(r.text)
        return

    tokens = r.json()
    p("Login Success! Tokens", tokens)
    access_token = tokens['access']
    headers = {'Authorization': f'Bearer {access_token}'}

    cat_url = f"{BASE_URL}/api/categories/"
    cat_data = {"name": "Groceries"}
    r = requests.post(cat_url, headers=headers, data=cat_data)
    print(f"DEBUG: Status {r.status_code}")
    # print(f"DEBUG: Response: {r.text}") # Commented out to avoid encoding errors
    try:
        p("Create Category Response", r.json())
    except:
        print("Failed to decode JSON")
    
    # If category created or exists, get ID
    if r.status_code == 201:
        cat_id = r.json()['id']
    else:
        # Fetch existing if duplicate
        r = requests.get(cat_url, headers=headers)
        cat_id = r.json()[0]['id']

    # 4. Create Expense
    exp_url = f"{BASE_URL}/api/expenses/"
    exp_data = {
        "amount": 50.00,
        "category": cat_id,
        "description": "Weekly Veggies",
        "date": "2024-12-16"
    }
    r = requests.post(exp_url, headers=headers, data=exp_data)
    p("Create Expense Response", r.json())

    # 5. Get Expenses
    r = requests.get(exp_url, headers=headers)
    p("List Expenses", r.json())

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"Error: {e}")
        print("Make sure the server is running on port 8000!")
