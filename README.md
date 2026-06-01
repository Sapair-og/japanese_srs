# Kyōto-Slate SRS ✒️

A responsive, high-performance Japanese vocabulary spaced-repetition (SRS) learning tool. Styled with a clean slate/paper aesthetic, interactive background canvas particles, and Genshin Impact elemental region themes.

Features user session syncing, a typed answer writing mode with automatic IME transliteration, audio pronunciation engine, and secure role-based admin gates.

---

## Core Features

- **Spaced Repetition Quizzer**: Flashcards auto-shuffle and filter by lesson categories. Tracks active accuracy metrics, speed, daily streaks, and custom session history logs.
- **Interactive Particle Themes**: The UI morphs color palettes and canvas particles based on Genshin Impact regions:
  - *Liyue* (Golden geo cores)
  - *Mondstadt* (Dandelion wind seeds)
  - *Inazuma* (Electro sparks)
  - *Sumeru* (Dendro leaves)
  - *Fontaine* (Hydro bubbles)
  - *Snezhnaya* (Cryo snow crystals)
  - *Natlan* (Pyro embers)
  - *Khaenri'ah* (Amber gear sparks)
  - *Abyss* (Void space embers)
- **Typed & Multiple Choice Modes**: Switch between picking definitions or typing the Japanese reading. Typing Romaji (e.g., `neko`) instantly converts to Hiragana (`ねこ`) in real-time.
- **Audio Pronunciation Engine**: Play custom vocal recordings uploaded by the admin (stored in Supabase Storage) or fallback to browser Japanese Speech Synthesis.
- **Multi-User Stats Syncing**: Accounts sync streaks, personal study calendars (GitHub-style heatmap consistency grids), and profile designs (Dicebear custom avatars) directly to the database.
- **Role-Based Security**: Only the designated administrator account can upload vocabulary lists, add cards, delete words, or trigger developer test previews. Regular users get a clean, read-only browser.

---

## Tech Stack

- **Frontend**: React (Vite), TailwindCSS, WanaKana (IME transliteration engine).
- **Backend/Database**: Supabase (Postgres, Storage buckets, Auth, Row-Level Security).

---

## Setup & Installation

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Sapair-og/japanese_srs.git
cd japanese_srs
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=your_admin_email_address
```

### 3. Database Migration
Run the SQL queries in `supabase_schema.sql` inside your Supabase SQL Editor. This initializes the tables (`vocabulary`, `user_profile`, `user_stats`, `user_study_dates`) and configures Row-Level Security (RLS) policies.

*Make sure to change `admin@example.com` in the SQL policy definitions to match your actual admin email address before executing.*

### 4. Run Locally
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```
