import sqlite3

def init_db():
    conn = sqlite3.connect('luminous_memory.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS case_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            user_query TEXT NOT NULL,
            simplified_info TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()
    print("SQLite Database anchored and initialized successfully.")

if __name__ == '__main__':
    init_db()
