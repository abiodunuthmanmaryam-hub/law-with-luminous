from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from google import genai
from google.genai import types

app = Flask(__name__)
CORS(app)

DB_FILE = 'luminous_memory.db'

# 1. Initialize the official Gemini Client
# Make sure your GEMINI_API_KEY environment variable is set in your terminal/system
client = genai.Client()

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# 2. Dynamic Legal AI Processing Engine with Domain-Specific System Instructions
def generate_legal_insight(user_query, law_type="Compare Both"):
    try:
        # Build a highly specific context based on frontend selector ("National Law", "Sharia Law", "Compare Both")
        context_prompt = f"The user specifically wants to focus on: {law_type}.\nUser Query: {user_query}"
        
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=context_prompt,
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are 'Law With Luminous', a specialized, domain-specific legal AI assistant expert "
                    "in Nigerian National Law (Statutory, Constitutional, and Civil Law) AND Sharia Law "
                    "(Islamic jurisprudence). Your purpose is to handle user queries, explain complex jargon, "
                    "and analyze legal documents. Break down complex text into clear language. "
                    "Always look at the issue through both lenses if applicable, and provide a clear, objective "
                    "side-by-side comparison between National Law and Sharia Law regarding matters like family law, "
                    "marriage, inheritance, property, contracts, and civil disputes. Keep your tone professional, "
                    "accessible, and culturally aware. Never give definitive formal legal counsel, but empower users with legal knowledge."
                )
            )
        )
        return response.text
    except Exception as e:
        return f"Error connecting to Luminous AI Engine: {str(e)}"

@app.route('/process', methods=['POST'])
def process_legal_info():
    data = request.json or {}
    user_query = data.get('query', '')
    # Grab the law type sent by the frontend selector (default to 'Compare Both' if missing)
    law_type = data.get('law_type', 'Compare Both') 
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM case_history')
    interaction_count = cursor.fetchone()[0]
    
    # NOTE: Keep the database count logic active for history tracking, 
    # but we will bypass the 403 lock block so your teacher's demo doesn't freeze up!
    """
    if interaction_count >= 5:
        conn.close()
        return jsonify({
            "error": "Memory limit reached.",
            "message": "You have reached your 5 free memory anchors. Please upgrade to Premium Pass."
        }), 403
    """

    # Call the actual Gemini live domain-specific legal engine
    simplified_result = generate_legal_insight(user_query, law_type)
    
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

@app.route('/history', methods=['GET'])
def get_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM case_history ORDER BY timestamp DESC')
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

if __name__ == '__main__':
    app.run(debug=True, port=5001)