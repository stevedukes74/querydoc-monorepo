# QueryDoc

An AI-powered document analysis application that lets you chat with your PDF documents using Claude AI.

## Features

- 📄 PDF document upload
- 💬 Real-time chat interface with streaming responses
- 🤖 Powered by Claude Sonnet 4.5
- ⚡ Built with React 19, TypeScript, and Vite
- 🧪 Comprehensive test coverage

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Testing Library + Vitest

### Backend
- Node.js + Express
- TypeScript
- Anthropic Claude API
- Vitest + Supertest

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- Yarn package manager
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/querydoc-monorepo.git
cd querydoc-monorepo
```

2. Install frontend dependencies:
```bash
cd frontend
yarn install
```

3. Install backend dependencies:
```bash
cd ../backend
yarn install
```

4. Set up environment variables:

Create `backend/.env`:
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
```

### Running the Application

1. Start the backend (in `backend/` directory):
```bash
yarn dev
```

2. Start the frontend (in `frontend/` directory):
```bash
yarn dev
```

3. Open http://localhost:5173 in your browser

### Running Tests

Frontend tests:
```bash
cd frontend
yarn test
```

Backend tests:
```bash
cd backend
yarn test
```

## Project Structure
```
querydoc-monorepo/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/          # UI Components (Single Responsibility)
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── FileUpload.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useChat.ts
│   │   │   └── useFileToBase64.ts
│   │   ├── services/            # API communication layer
│   │   │   └── api.ts
│   │   ├── test/                # Test configuration
│   │   │   └── setup.ts
│   │   ├── types.ts             # TypeScript type definitions
│   │   ├── App.tsx              # Root component
│   │   ├── main.tsx             # Application entry point
│   │   └── index.css            # Global styles (Tailwind)
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   └── tailwind.config.js
│
├── backend/                     # Express backend API
│   ├── src/
│   │   ├── routes/              # Route definitions (thin layer)
│   │   │   ├── health.routes.ts
│   │   │   └── chat.routes.ts
│   │   ├── controllers/         # Request/response handling
│   │   │   ├── health.controller.ts
│   │   │   └── chat.controller.ts
│   │   ├── services/            # Business logic
│   │   │   ├── chat.service.ts
│   │   │   └── anthropic.service.ts
│   │   ├── middleware/          # Validation, error handling
│   │   │   ├── validation.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── config/              # Configuration
│   │   │   └── env.ts
│   │   ├── types/               # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── test/                # Test configuration
│   │   │   └── setup.ts
│   │   ├── app.ts               # Express app setup
│   │   └── server.ts            # Entry point (starts server)
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
└── README.md
```

## License

MIT

## Author

Steve - Senior Frontend Engineer