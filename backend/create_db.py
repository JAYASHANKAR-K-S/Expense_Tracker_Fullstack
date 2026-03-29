import MySQLdb
try:
    db = MySQLdb.connect(host="localhost", user="root", passwd="root")
    cursor = db.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS expense_tracker_db")
    print("Database created successfully")
except Exception as e:
    print(f"Error creating database: {e}")
