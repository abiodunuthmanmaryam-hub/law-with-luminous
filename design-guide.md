# Law With Luminous - Design Guide & Architecture

## Design Philosophy
"Lighting Your Path Through Nigerian Law" / "Making Law Clear for Every Nigerian"

### Core Requirements
1. **Coverage**: All areas of Nigerian Law.
2. **Language & Accessibility**: Support multiple languages (English, Pidgin, Yoruba, Igbo, Hausa).
3. **Target Audience**: Everyone from people who can barely read to highly educated professionals.

### Brand Colors
- **Navy**: `#1B3A5E` (Trust, Authority, Law)
- **Luminous Yellow**: `#FDB913` (Light, Clarity, Guiding Path)

### Tone & Language
- NEVER use legal jargon - If you must, explain immediately after.
- Use "you/your" - Direct and personal.
- Use Nigerian examples.
- Acknowledge real problems (e.g., NEPA/EEDC disconnecting power).
- Be empowering.

### Architecture Guide
- **Frontend**: React + Vite + Tailwind CSS
- **Backend Node.js**: Express + SQLite (User Data, Comments, Admin, Content Delivery)
- **Backend Python**: FastAPI (AI "Legal Brain" Logic / Search engine processing if applicable)
- **Deployment**: Vercel (Frontend), Render (Backend)

### The Translation Engine
- One-to-Many relationship for articles: One `article_id` links to five different rows in the `article_translations` table. This allows easy expansion to more languages later.

### Admin Moderation Logic
- Pending comments use `approved = 0`. They never appear on the live site until an Admin clicks "Approve" via the dashboard.

### Biometric Placeholder
- The system will feature placeholder UI components for Face/Fingerprint recognition, ready for integration with WebAuthn once deployed with an SSL certificate.
