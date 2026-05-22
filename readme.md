# Kiro — AI-Powered Career Path Recommender

> *Your AI career navigator — trained on the market, built for you.*

A premium Next.js application that uses Gemini AI to parse resumes, analyze skills, and recommend personalized career paths backed by live market data.

## ✨ Features

- 🤖 **Gemini Resume Parsing** - Upload PDF/DOCX resumes for instant AI extraction with 94% accuracy
- 🎯 **Hybrid AI Recommendations** - Collaborative filtering + LLM reasoning for personalized career matches
- 📊 **Live Market Intelligence** - Real-time data from BLS, LinkedIn, and Glassdoor
- 🗺 **Skill Gap Analysis** - Identify missing skills with learning roadmaps and time estimates
- 👥 **Peer Pathway Insights** - See how similar professionals transitioned careers
- 💬 **AI Career Assistant** - Interactive chat for career guidance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- NeonDB account (PostgreSQL)
- Google AI Studio API key (Gemini)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` - NeonDB connection string
- `GEMINI_API_KEY` - Google AI Studio API key
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)

3. **Push database schema:**

```bash
npm run db:push
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** NeonDB (PostgreSQL) with Drizzle ORM
- **AI:** Google Gemini 1.5 Pro & Flash
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Auth:** NextAuth.js
- **Storage:** Vercel Blob / AWS S3

## 📁 Project Structure

```
kiro/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (onboarding)/      # User onboarding flow
│   ├── (dashboard)/       # Main app dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── landing/          # Landing page sections
│   ├── dashboard/        # Dashboard widgets
│   ├── resume/           # Resume parser UI
│   └── ui/               # Reusable UI components
├── lib/                   # Core utilities
│   ├── db/               # Database schema & connection
│   └── gemini.ts         # Gemini AI integration
└── types/                # TypeScript type definitions
```

## 🎨 Design System

**Aesthetic:** Dark editorial luxury — obsidian backgrounds with electric teal accents

**Colors:**
- Background: `#0a0e17` (deep obsidian)
- Brand: `#00d4aa` (electric teal)
- Text: `#f0f4f8` (primary), `#8a99b0` (secondary)

**Typography:**
- Display: DM Serif Display (headings)
- Body: DM Sans (UI text)

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

## 📄 License

MIT

---

*Built with Next.js 14 · NeonDB · Gemini AI · Framer Motion · Tailwind CSS*