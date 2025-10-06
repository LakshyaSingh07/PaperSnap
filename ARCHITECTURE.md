# System Architecture 🏗️

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     http://localhost:3000                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP Requests
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND                              │
│                         (Vite)                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  App.jsx - Main Component                                 │  │
│  │  ├─ Left Column (30%)                                     │  │
│  │  │  └─ Upload Section (Card)                             │  │
│  │  └─ Right Column (70%)                                    │  │
│  │     ├─ Summary Display (Card)                            │  │
│  │     └─ Q&A Section (Card)                                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  UI Components: Button, Card, Input (shadcn/ui)                 │
│  Styling: Tailwind CSS                                          │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        │ Axios HTTP Client
                        │ POST /upload (FormData)
                        │ POST /qa (JSON)
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS BACKEND                               │
│                  http://localhost:3001                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  server.js                                                │  │
│  │                                                           │  │
│  │  Routes:                                                  │  │
│  │  ├─ POST /upload ────────────┐                          │  │
│  │  │   ├─ Multer (file upload)  │                          │  │
│  │  │   ├─ pdf-parse (extract)   │                          │  │
│  │  │   └─ Store in memory       │                          │  │
│  │  │                            │                          │  │
│  │  ├─ POST /qa ─────────────────┤                          │  │
│  │  │   ├─ Get stored text       │                          │  │
│  │  │   └─ Create prompt         │                          │  │
│  │  │                            │                          │  │
│  │  └─ GET /health               │                          │  │
│  └────────────────────────────────┼────────────────────────────┘
│                                   │                              │
│  In-Memory Storage:               │                              │
│  ┌─────────────────────┐         │                              │
│  │ paperContext        │         │                              │
│  │ ├─ text: "..."      │         │                              │
│  │ └─ filename: "..."  │         │                              │
│  └─────────────────────┘         │                              │
└───────────────────────────────────┼───────────────────────────┘
                                    │
                                    │ OpenAI API Call
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       OPENAI API                                 │
│                   (gpt-4o-mini model)                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Summarization:                                           │  │
│  │  ├─ Full summary                                          │  │
│  │  ├─ 5 bullet points                                       │  │
│  │  └─ Section-wise analysis                                │  │
│  │                                                           │  │
│  │  Q&A:                                                     │  │
│  │  └─ Context-aware answers                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. PDF Upload Flow

```
User Action                    Frontend                Backend                 OpenAI
─────────────────────────────────────────────────────────────────────────────────────

Select PDF
    │
    ├──► Click "Upload"
    │         │
    │         ├──► FormData + PDF
    │         │         │
    │         │         ├──► POST /upload
    │         │         │         │
    │         │         │         ├──► Multer receives file
    │         │         │         │
    │         │         │         ├──► pdf-parse extracts text
    │         │         │         │
    │         │         │         ├──► Store in paperContext
    │         │         │         │
    │         │         │         ├──► Create prompt ─────────► Chat Completion
    │         │         │         │                                    │
    │         │         │         ◄──── Response with summary ◄────────┘
    │         │         │         │
    │         │         ◄─────────┤ JSON: { summary, filename }
    │         │         │
    │         ◄─────────┤
    │         │
    │         ├──► Display summary
    │         │
    ◄─────────┤ See results on screen

```

### 2. Q&A Flow

```
User Action                    Frontend                Backend                 OpenAI
─────────────────────────────────────────────────────────────────────────────────────

Type question
    │
    ├──► Click "Ask"
    │         │
    │         ├──► JSON: { question }
    │         │         │
    │         │         ├──► POST /qa
    │         │         │         │
    │         │         │         ├──► Get paperContext.text
    │         │         │         │
    │         │         │         ├──► Create prompt ─────────► Chat Completion
    │         │         │         │                                    │
    │         │         │         ◄──── Response with answer ◄─────────┘
    │         │         │         │
    │         │         ◄─────────┤ JSON: { question, answer }
    │         │         │
    │         ◄─────────┤
    │         │
    │         ├──► Add to qaHistory
    │         │
    │         ├──► Display in history
    │         │
    ◄─────────┤ See answer on screen

```

---

## Technology Stack Details

### Frontend Stack

```
React 18.2
    ├── Vite (Build Tool & Dev Server)
    │   └── Fast HMR, ES modules
    │
    ├── Tailwind CSS (Styling)
    │   └── Utility-first CSS framework
    │
    ├── shadcn/ui (Components)
    │   ├── Button
    │   ├── Card (+ Header, Content, Footer)
    │   └── Input
    │
    ├── Axios (HTTP Client)
    │   └── API requests to backend
    │
    └── Lucide React (Icons)
        ├── Upload
        ├── Send
        ├── FileText
        └── Loader2
```

### Backend Stack

```
Node.js + Express
    ├── Express (Web Framework)
    │   └── Routing, middleware
    │
    ├── Multer (File Upload)
    │   └── Handles multipart/form-data
    │
    ├── pdf-parse (PDF Processing)
    │   └── Extracts text from PDF buffer
    │
    ├── OpenAI SDK (AI Integration)
    │   ├── Model: gpt-4o-mini
    │   ├── Chat completions API
    │   └── Temperature: 0.7
    │
    ├── CORS (Cross-Origin)
    │   └── Allows frontend to call backend
    │
    └── dotenv (Environment Variables)
        └── Loads .env configuration
```

---

## Component Hierarchy

```
App.jsx (Main Container)
│
├── Header
│   └── Title + Logo
│
└── Main (Grid Layout)
    │
    ├── Left Column (30%)
    │   └── Card (Upload Section)
    │       ├── CardHeader
    │       │   ├── CardTitle: "Welcome!"
    │       │   └── CardDescription
    │       │
    │       └── CardContent
    │           ├── File Input (hidden)
    │           ├── Select Button
    │           ├── Upload Button
    │           └── Feature List
    │
    └── Right Column (70%)
        │
        ├── Empty State (when no paper)
        │   └── Card with placeholder
        │
        └── Loaded State (when paper uploaded)
            │
            ├── Card (Summary)
            │   ├── CardHeader
            │   │   ├── CardTitle: "AI-Generated Summary"
            │   │   └── CardDescription: filename
            │   │
            │   └── CardContent
            │       └── Parsed summary sections
            │
            └── Card (Q&A)
                ├── CardHeader
                │   ├── CardTitle: "Ask Questions"
                │   └── CardDescription
                │
                └── CardContent
                    ├── Q&A History (scrollable)
                    │   └── [Question + Answer pairs]
                    │
                    └── Input Section
                        ├── Input (question)
                        └── Button (Ask)
```

---

## State Management

```javascript
Frontend State (React useState):
├── file: File | null
├── uploading: boolean
├── summary: string | null
├── filename: string
├── question: string
├── qaHistory: Array<{question, answer}>
└── askingQuestion: boolean

Backend State (In-Memory):
└── paperContext: {
    ├── text: string
    └── filename: string
}
```

---

## API Contract

### POST /upload

**Request:**
```http
POST /upload HTTP/1.1
Content-Type: multipart/form-data

file: [PDF binary data]
```

**Response:**
```json
{
  "success": true,
  "filename": "research-paper.pdf",
  "summary": "Full AI-generated summary...",
  "textLength": 25430
}
```

### POST /qa

**Request:**
```http
POST /qa HTTP/1.1
Content-Type: application/json

{
  "question": "What is the main contribution?"
}
```

**Response:**
```json
{
  "success": true,
  "question": "What is the main contribution?",
  "answer": "The main contribution is..."
}
```

### GET /health

**Request:**
```http
GET /health HTTP/1.1
```

**Response:**
```json
{
  "status": "ok",
  "paperLoaded": true,
  "filename": "research-paper.pdf"
}
```

---

## Security Considerations

### Current Implementation (MVP)
- ❌ No authentication
- ❌ No rate limiting
- ❌ No file size validation
- ❌ No malicious PDF protection
- ❌ API key exposed on server only (not in frontend)

### Recommended for Production
- ✅ Add user authentication (JWT)
- ✅ Implement rate limiting (express-rate-limit)
- ✅ Add file size limits (multer limits)
- ✅ Validate PDF structure
- ✅ Use environment-specific configs
- ✅ Add HTTPS/SSL
- ✅ Implement proper error logging
- ✅ Add request validation (joi/zod)

---

## Performance Characteristics

### Bottlenecks
1. **OpenAI API Call**: 5-30 seconds depending on paper length
2. **PDF Parsing**: 1-3 seconds for typical papers
3. **Network**: Depends on user's connection

### Optimizations Applied
- ✅ Loading states for all async operations
- ✅ Text truncation to avoid OpenAI token limits
- ✅ In-memory storage for fast Q&A
- ✅ Single-page app (no navigation delay)

### Future Optimizations
- 🔄 Add caching for repeated papers
- 🔄 Implement streaming responses
- 🔄 Add progress indicators for long operations
- 🔄 Use WebSocket for real-time updates

---

## Deployment Architecture

```
Production Setup (Recommended):

Frontend (Static Hosting)          Backend (Server)           External Services
─────────────────────────────────────────────────────────────────────────────────

Vercel/Netlify                    Railway/Render              OpenAI API
    │                                  │                          │
    ├─ Static files                    ├─ Express server          └─ GPT-4o-mini
    ├─ CDN                             ├─ Environment vars
    └─ HTTPS                           ├─ CORS config
                                       └─ HTTPS

Database (Optional):
    │
    └─ PostgreSQL/MongoDB
       ├─ User sessions
       ├─ Paper history
       └─ Q&A logs
```

---

This architecture provides a clean separation of concerns, making it easy to:
- Scale frontend and backend independently
- Swap out components (e.g., different AI providers)
- Add features without major refactoring
- Deploy to various hosting platforms

