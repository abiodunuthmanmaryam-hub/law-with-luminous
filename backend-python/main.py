from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

# Initialize the modern GenAI Client.
# It automatically reads GEMINI_API_KEY from your environment variables.
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    client = genai.Client()
else:
    client = None
    print("⚠️ WARNING: GEMINI_API_KEY not found in .env")

app = FastAPI(title="Law With Luminous - Legal Brain API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upgraded schema to accept the choice from your frontend selector
class SearchQuery(BaseModel):
    query: str
    language: str = "en"
    law_type: str = "Compare Both"  # Options from frontend: "National Law", "Sharia Law", "Compare Both"

# Database path resolution
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "backend-node" / "database.sqlite"

# Define the permanent Domain-Specific System Instructions
SYSTEM_INSTRUCTION = (
    "You are 'Luminous', a specialized, domain-specific legal AI assistant expert "
    "in Nigerian National Law (Statutory, Constitutional, and Civil Law) AND Sharia Law "
    "(Islamic jurisprudence). Your purpose is to handle user queries, explain complex jargon, "
    "and analyze legal issues. When analyzing cases, look at the problems through both lenses "
    "if relevant, providing a clear, objective comparison between National Law and Sharia Law "
    "regarding family law, marriage, inheritance, property, and contracts."
)

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
        
        # Even if database results are empty, let the live AI generate a response using its training data!
        if client:
            context = ""
            if results:
                context = "\n".join([f"Article: {r['title']}\nSummary: {r['simple_version']}\nRights: {r['your_rights']}" for r in results])
            else:
                context = "No specific local database articles matched. Rely on your core training data."
            
            # Dynamic prompt built around their legal category choice
            prompt = f"""
            The user wants to analyze this issue specifically through: {search.law_type}
            User Query: '{search.query}'
            
            Provide a clear, comforting, and structured overview matching their requested focus.
            
            Rules:
            1. Use plain language (no complex jargon).
            2. If language is 'pcm' (Pidgin), use natural Nigerian Pidgin.
            3. If the focus is 'Compare Both', provide a clear side-by-side view of National Law vs. Sharia Law.
            4. Be empowering but remind them this is not official legal advice from a lawyer.
            5. Focus on what they SHOULD DO next.
            6. Keep it concise, engaging, and professional.
            
            Local Database Context:
            {context}
            """
            
            try:
                # Updated content generation structure matching the google-genai package
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_INSTRUCTION,
                        temperature=0.3
                    )
                )
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
