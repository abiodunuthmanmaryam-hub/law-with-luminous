from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # type: ignore

DB_FILE = 'luminous_memory.db'

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def translate_statute_to_plain_language(legal_text):
    return "Simplified Information: This statute means you have the explicit right to review your records without hidden fees."

# Cleaned Route: This maps perfectly to /api/python/process on Vercel
@app.route('/process', methods=['POST'])
def process_legal_info():
    data = request.json or {}
    user_query = data.get('query', '')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM case_history')
    interaction_count = cursor.fetchone()[0]
    
    if interaction_count >= 5:
        conn.close()
        return jsonify({
            "error": "Memory limit reached.",
            "message": "You have reached your 5 free memory anchors. Please upgrade to Premium Pass."
        }), 403

    simplified_result = translate_statute_to_plain_language(user_query)
    
    cursor.execute(
        'INSERT INTO case_history (user_query, simplified_info) VALUES (?, ?)',
        (user_query, simplified_result)
    )
    conn.commit()
    conn.close()
    
    return jsonify({
        "status": "Success",
        "simplified_info": simplified_result,
        "anchors_used": interaction_count + 1
    })

# Cleaned Route: This maps perfectly to /api/python/history on Vercel
@app.route('/history', methods=['GET'])
def get_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM case_history ORDER BY timestamp DESC')
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

if __name__ == '__main__':
    app.run(port=5000, debug=True)