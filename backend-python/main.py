from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    # Using gemini-1.5-flash for speed and reliability
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None
    print("⚠️ WARNING: GEMINI_API_KEY not found in .env")

app = FastAPI(title="Law With Luminous - Legal Brain API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchQuery(BaseModel):
    query: str
    language: str = "en"

# Database path resolution
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "backend-node" / "database.sqlite"

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "🌟 Law With Luminous Legal Brain is active",
        "db_connected": os.path.exists(DB_PATH)
    }

@app.post("/api/search")
def ai_legal_search(search: SearchQuery):
    if not os.path.exists(DB_PATH):
        print(f"❌ DB NOT FOUND AT: {DB_PATH}")
        return {
            "results": [],
            "ai_summary": "I'm sorry, I couldn't access the legal database right now. Please try again in a moment."
        }
        
    try:
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            search_term = f"%{search.query}%"
            
            # Search across translations
            query = """
                SELECT t.title, t.what_is_this, t.simple_version, t.your_rights, a.slug
                FROM article_translations t
                JOIN articles a ON t.article_id = a.id
                WHERE t.language_code = ? AND (t.title LIKE ? OR t.what_is_this LIKE ? OR t.simple_version LIKE ?)
                LIMIT 3
            """
            
            cursor.execute(query, (search.language, search_term, search_term, search_term))
            rows = cursor.fetchall()
            results = [dict(row) for row in rows]
            
        ai_summary = "I found some legal information that might help you."
        
        if model and results:
            context = "\n".join([f"Article: {r['title']}\nSummary: {r['simple_version']}\nRights: {r['your_rights']}" for r in results])
            
            # Refined prompt for Nigerian context
            prompt = f"""
            You are 'Luminous', a friendly and expert Nigerian AI Legal Assistant. 
            The user is asking: '{search.query}'
            
            Based on the following articles from our Nigerian Legal Database, provide a very short, comforting, and clear summary in {search.language}.
            
            Rules:
            1. Use plain language (no complex jargon).
            2. If language is 'pcm' (Pidgin), use natural Nigerian Pidgin.
            3. Be empowering but remind them this is not official legal advice from a lawyer.
            4. Focus on what they SHOULD DO next.
            5. Keep it under 100 words.
            
            Articles:
            {context}
            """
            
            try:
                response = model.generate_content(prompt)
                ai_summary = response.text.strip()
            except Exception as ai_err:
                print(f"Gemini AI Error: {ai_err}")
                ai_summary = results[0]['simple_version'] if results else ai_summary
            
        return {
            "results": results,
            "ai_summary": ai_summary,
            "query": search.query
        }
    except Exception as e:
        print(f"Search Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
