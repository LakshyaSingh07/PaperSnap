# Backend Server

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

3. Start the server:
```bash
npm start
```

The server will run on http://localhost:3001

## Available Routes

- `POST /upload` - Upload and process PDF
- `POST /qa` - Ask questions about the paper
- `GET /health` - Health check

## Development

For auto-reload on changes:
```bash
npm run dev
```

