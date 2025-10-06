# Quick Start Guide 🚀

## 5-Minute Setup

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure OpenRouter API Key

Create a file `backend/.env` with:
```
OPENAI_API_KEY=sk-or-v1-your-openrouter-api-key-here
PORT=3001
```

Get your API key at: https://openrouter.ai/keys

### Step 3: Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Backend running at http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running at http://localhost:3000

### Step 4: Use the App

1. Open http://localhost:3000 in your browser
2. Click "Select PDF File" and choose a research paper
3. Click "Get Started / Upload Paper"
4. Wait 10-30 seconds for AI processing
5. View the summary and ask questions!

## Troubleshooting

**Issue**: "Failed to upload and process PDF"
- ✓ Check backend is running on port 3001
- ✓ Verify OpenRouter API key in `.env` file
- ✓ Ensure you have credits at openrouter.ai

**Issue**: "CORS Error"
- ✓ Make sure both servers are running
- ✓ Frontend should be on port 3000, backend on 3001

**Issue**: "Cannot find module"
- ✓ Run `npm install` in both frontend and backend directories

## Need Help?

See the full [README.md](./README.md) for detailed documentation.

