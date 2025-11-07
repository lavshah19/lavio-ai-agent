# Lavio — AI Agent

Lavio is a full-stack AI chat agent built with Next.js 16, LangChain, and Prisma. It combines Groq-hosted LLMs, LangGraph orchestration, Better Auth sessions, and a Qdrant vector store to deliver conversational assistance that can browse the web, inspect images, and ground answers in user-uploaded PDFs.

## Features

- Conversational AI powered by Groq models orchestrated through LangGraph state machines for tool-aware responses.
- Retrieval-augmented generation via Qdrant: PDFs are embedded with Hugging Face inference, stored, and retrieved per conversation for grounded answers.
- Multi-modal tooling, including Tavily web search and OpenRouter-powered image description for vision queries.
- Secure authentication backed by Better Auth with Google OAuth, role support, and Prisma/MongoDB persistence.
- Cloudinary-backed file uploads with automatic local PDF processing and embeddings generation.
- Modern UI built with React 19, Tailwind CSS, and shadcn-inspired components, featuring responsive chat, file previews, and streaming states.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Database:** MongoDB via Prisma ORM
- **Authentication:** Better Auth + Google OAuth
- **AI & Retrieval:** LangChain, LangGraph, Groq LLMs, Tavily, Hugging Face embeddings, Qdrant vector store
- **Storage & Assets:** Cloudinary, local PDF ingestion
- **Styling & UI:** Tailwind CSS 4, Radix UI primitives, Lucide icons

## Architecture Highlights

- `src/lib/ai` contains the LangGraph state machine and tool definitions that decide when to call web search, vision, or retrieval tools before returning a model response.
- `src/action/Cloudinary-action.ts` handles uploads, PDF parsing, embedding generation, and Cloudinary persistence, keeping large files off the Next.js server.
- `src/lib/vectorStore` wraps Qdrant for document retrieval, while `docker-compose.yml` offers a local Qdrant instance for development.
- `prisma/schema.prisma` defines the data layer for users, sessions, conversations, messages, and file attachments.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm, npm, or yarn (examples use npm)
- MongoDB instance (Atlas or local)
- Qdrant (Docker or managed)

### Installation

```bash
git clone https://github.com/<your-username>/lavio-ai-agent.git
cd lavio-ai-agent
npm install
```

### Environment Variables

Create a `.env` file in the project root with:

```dotenv
DATABASE_URL="mongodb+srv://..."
GROQ_API_KEY="..."
TAVILY_API_KEY="..."
OPENROUTER_API_KEY="..."
HUGGINGFACEHUB_API_KEY="..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

Optional (but recommended): set Better Auth secrets, e.g. `BETTER_AUTH_SECRET` if you configure one.

### Database & Vector Store

```bash
# Generate Prisma client and sync schema
npx prisma generate
npx prisma db push

# Start Qdrant locally (runs on :6333)
docker compose up qdrant
```

### Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` to sign in and start chatting.

## Project Structure

```text
src/
  action/              – Server actions (chat, uploads)
  app/                 – Next.js routes (auth, chat, API)
  components/          – UI primitives and chat widgets
  lib/
    ai/                – LangGraph agent, tools, and model bindings
    auth*.ts           – Better Auth server/client helpers
    cloudinary/        – Cloudinary configuration
    vectorStore/       – Qdrant helpers and RAG logic
    prisma.ts          – Prisma client wrapper
```

## Available Scripts

- `npm run dev` – Start the Next.js dev server
- `npm run build` – Create a production build
- `npm run start` – Run the production server
- `npm run lint` – Lint the codebase with ESLint

## Roadmap

- Expand memory and session controls across conversations
- Add real-time streaming for tool invocations
- Support additional document types beyond PDF
- Introduce role-based dashboards using Better Auth admin plugin

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-change`)
3. Commit changes and push (`git push origin feat/amazing-change`)
4. Open a Pull Request describing your updates

## License

This project is currently unlicensed. Add a license file before publishing if you plan to open-source it.



