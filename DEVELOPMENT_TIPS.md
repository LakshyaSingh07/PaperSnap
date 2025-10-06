# Development Tips & Customization Guide 🛠️

## Customizing the Application

### Changing Colors/Theme

Edit `frontend/src/index.css` to modify the color scheme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Main blue color */
  --secondary: 210 40% 96.1%;    /* Light gray */
  --accent: 210 40% 96.1%;       /* Accent color */
}
```

Colors use HSL format: `hue saturation% lightness%`

### Adjusting Layout Proportions

In `frontend/src/App.jsx`, change the grid columns:

```jsx
// Current: 30% left, 70% right
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-1">  {/* Left: 1/3 = 33% */}
  <div className="lg:col-span-2">  {/* Right: 2/3 = 67% */}

// For 40% left, 60% right:
<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
  <div className="lg:col-span-2">  {/* Left: 2/5 = 40% */}
  <div className="lg:col-span-3">  {/* Right: 3/5 = 60% */}
```

### Modifying AI Prompts

Edit `backend/server.js` to customize how summaries are generated:

```javascript
// Line ~45-60
const prompt = `You are a research paper summarization assistant...`;

// Examples:
// - Add more sections: "Discussion", "Limitations"
// - Change bullet points: "10 key points" instead of 5
// - Add specific focus: "Focus on practical applications"
```

### Changing OpenAI Model

In `backend/server.js`:

```javascript
// Current model: gpt-4o-mini (fast, cheap)
model: 'gpt-4o-mini',

// For better quality (slower, more expensive):
model: 'gpt-4o',

// For cheaper (lower quality):
model: 'gpt-3.5-turbo',
```

**Token Limits:**
- `gpt-4o-mini`: Up to 128k tokens
- `gpt-4o`: Up to 128k tokens
- `gpt-3.5-turbo`: Up to 16k tokens

### Adjusting Text Length Limits

In `backend/server.js`:

```javascript
// Line ~53 (for summary)
${extractedText.substring(0, 12000)}  // Current: ~12k characters

// Line ~92 (for Q&A)
${paperContext.text.substring(0, 10000)}  // Current: ~10k characters

// Increase for longer papers (watch OpenAI token limits)
// 1 token ≈ 4 characters
```

### Modifying Max Tokens for Responses

In `backend/server.js`:

```javascript
// For summaries (line ~64)
max_tokens: 2000,  // Increase for longer summaries

// For Q&A (line ~103)
max_tokens: 500,   // Increase for detailed answers
```

---

## Adding New Features

### 1. Add File Size Limit

In `backend/server.js`, modify multer config:

```javascript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
```

### 2. Add Multiple Paper Support

Replace in-memory storage with an object:

```javascript
// Instead of single paperContext:
const papers = {}; // { sessionId: { text, filename } }

// Generate session ID in /upload
const sessionId = crypto.randomUUID();
papers[sessionId] = { text, filename };

// Return sessionId to frontend
// Frontend stores and sends sessionId in subsequent /qa requests
```

### 3. Add Export Summary Feature

Frontend addition:

```jsx
const exportSummary = () => {
  const blob = new Blob([summary], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-summary.txt`;
  a.click();
};

<Button onClick={exportSummary}>Export Summary</Button>
```

### 4. Add Copy to Clipboard

```jsx
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
};

<Button onClick={() => copyToClipboard(summary)}>
  Copy Summary
</Button>
```

### 5. Add Progress Indicator

Backend: Use Server-Sent Events (SSE)
Frontend: Use EventSource API

Or simpler: Add status messages:

```javascript
// Backend
const updates = {
  parsing: 'Extracting text from PDF...',
  summarizing: 'Generating AI summary...',
  complete: 'Done!',
};
```

### 6. Add arXiv URL Support

Backend endpoint:

```javascript
app.post('/upload-url', async (req, res) => {
  const { url } = req.body;
  // Use axios to download PDF
  // Then process same as /upload
});
```

---

## Debugging Tips

### Enable Detailed Logging

Backend (`server.js`):

```javascript
// Add at the top
const DEBUG = true;

// Use throughout:
if (DEBUG) console.log('Processing PDF:', details);
```

### View Network Requests

Frontend:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Upload a PDF and watch requests
4. Click on requests to see payload/response

### Test Backend Independently

Use Postman or curl:

```bash
# Test upload
curl -X POST http://localhost:3001/upload \
  -F "file=@path/to/paper.pdf"

# Test Q&A
curl -X POST http://localhost:3001/qa \
  -H "Content-Type: application/json" \
  -d '{"question":"What is the main topic?"}'

# Test health
curl http://localhost:3001/health
```

### Common Issues

**Issue**: "Module not found"
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Changes not reflecting
```bash
# Frontend: Vite auto-reloads, but try:
Ctrl + R (hard refresh)

# Backend: Restart server
Ctrl + C, then npm start
```

**Issue**: CORS errors
```javascript
// Backend: Verify CORS is enabled
app.use(cors());

// Or be specific:
app.use(cors({
  origin: 'http://localhost:3000',
}));
```

---

## Performance Optimization

### 1. Cache OpenAI Responses

```javascript
const cache = new Map();

const cacheKey = `${paperContext.text.substring(0, 100)}_${question}`;
if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}

// After getting response:
cache.set(cacheKey, answer);
```

### 2. Compress PDF Text

```javascript
// Before storing:
const compressed = require('zlib').gzipSync(extractedText);
paperContext.text = compressed;

// Before using:
const text = require('zlib').gunzipSync(paperContext.text).toString();
```

### 3. Add Request Timeouts

```javascript
// In OpenAI calls:
const completion = await openai.chat.completions.create({
  // ... other params
}, {
  timeout: 30000, // 30 seconds
});
```

---

## Code Quality Tools

### ESLint (Linting)

```bash
# Install
npm install -D eslint

# Initialize
npx eslint --init

# Run
npx eslint src/
```

### Prettier (Formatting)

```bash
# Install
npm install -D prettier

# Create .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}

# Run
npx prettier --write src/
```

### TypeScript (Type Safety)

Convert to TypeScript:

```bash
# Install
npm install -D typescript @types/react @types/node

# Rename files: .jsx → .tsx, .js → .ts
# Add tsconfig.json
```

---

## Testing

### Frontend Testing (Vitest + React Testing Library)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Example test:

```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
});
```

### Backend Testing (Jest + Supertest)

```bash
npm install -D jest supertest
```

Example test:

```javascript
const request = require('supertest');
const app = require('./server');

test('GET /health returns ok', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('ok');
});
```

---

## Environment Variables

### Multiple Environments

Create:
- `.env.development`
- `.env.production`
- `.env.test`

Load based on NODE_ENV:

```javascript
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
```

### Frontend Environment Variables

Vite uses `VITE_` prefix:

```env
# .env
VITE_API_URL=http://localhost:3001
```

```javascript
// In App.jsx
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Git Workflow

### Commit Messages

```bash
# Good commits:
git commit -m "feat: add PDF file size validation"
git commit -m "fix: resolve CORS issue in production"
git commit -m "docs: update README with deployment guide"
git commit -m "style: format code with prettier"

# Categories: feat, fix, docs, style, refactor, test, chore
```

### Branches

```bash
# Feature branch
git checkout -b feature/export-summary

# Bug fix
git checkout -b fix/upload-error

# Merge back
git checkout main
git merge feature/export-summary
```

---

## Useful VS Code Extensions

1. **ES7+ React/Redux/React-Native snippets** - React snippets
2. **Tailwind CSS IntelliSense** - Tailwind autocomplete
3. **ESLint** - Code linting
4. **Prettier** - Code formatting
5. **Thunder Client** - API testing
6. **Auto Rename Tag** - HTML/JSX tag renaming

---

## Quick Reference

### Frontend File Structure
```
src/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utilities
├── api/             # API client functions
└── types/           # TypeScript types
```

### Backend File Structure
```
backend/
├── routes/          # Route handlers
├── middleware/      # Express middleware
├── services/        # Business logic
├── utils/           # Helper functions
└── config/          # Configuration files
```

### Key Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
npm start            # Start server
npm run dev          # Start with auto-reload
node --version       # Check Node version

# Both
npm install          # Install dependencies
npm update           # Update dependencies
npm audit fix        # Fix security issues
```

---

## Resources

- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **Express Docs**: https://expressjs.com
- **OpenAI API**: https://platform.openai.com/docs
- **Vite Guide**: https://vitejs.dev

---

Happy coding! 🚀

