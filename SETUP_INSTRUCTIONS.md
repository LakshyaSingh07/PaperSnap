# Complete Setup Instructions for Windows 🪟

## Prerequisites Check

Before starting, verify you have:
- ✅ Node.js installed (v18+): Run `node --version`
- ✅ npm installed: Run `npm --version`
- ✅ OpenAI API Key: Get from https://platform.openai.com/api-keys

If Node.js is not installed, download from: https://nodejs.org/

---

## Step-by-Step Setup

### 1. Install Backend Dependencies

Open PowerShell or Command Prompt in the project directory:

```powershell
cd backend
npm install
```

This will install:
- express (web server)
- pdf-parse (PDF processing)
- openai (AI integration)
- multer (file uploads)
- cors (cross-origin support)
- dotenv (environment variables)

**Expected output**: "added X packages" (takes ~30-60 seconds)

---

### 2. Configure OpenAI API Key

Create a new file in the `backend` directory called `.env`:

```powershell
# While in backend directory
notepad .env
```

Add these two lines:
```
OPENAI_API_KEY=sk-proj-your-actual-key-here
PORT=3001
```

**IMPORTANT**: Replace `sk-proj-your-actual-key-here` with your real OpenAI API key!

Save and close Notepad.

---

### 3. Install Frontend Dependencies

Open a **new** PowerShell/Command Prompt window:

```powershell
cd frontend
npm install
```

This will install:
- react + react-dom (UI framework)
- vite (build tool)
- tailwindcss (styling)
- axios (HTTP client)
- lucide-react (icons)
- shadcn/ui components

**Expected output**: "added X packages" (takes ~30-60 seconds)

---

### 4. Start Backend Server

In the **first terminal** (backend directory):

```powershell
npm start
```

**Expected output**:
```
✅ Server running on http://localhost:3001
📝 Upload endpoint: POST http://localhost:3001/upload
💬 Q&A endpoint: POST http://localhost:3001/qa
```

**Keep this terminal open!** The backend must keep running.

---

### 5. Start Frontend Server

In the **second terminal** (frontend directory):

```powershell
npm run dev
```

**Expected output**:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Keep this terminal open!** The frontend must keep running.

---

### 6. Open the Application

Open your web browser and go to:
```
http://localhost:3000
```

You should see the **Research Paper Summarizer** interface!

---

## Using the Application

### Upload a Paper
1. Click **"Select PDF File"** on the left panel
2. Choose a research paper PDF from your computer
3. Click **"Get Started / Upload Paper"**
4. Wait 10-30 seconds for AI processing

### View Summary
- The right panel will display:
  - Full summary
  - 5 key bullet points
  - Section-wise analysis

### Ask Questions
1. Type your question in the input box at the bottom
2. Click **"Ask"** or press Enter
3. View the AI-generated answer
4. All Q&A history is preserved during the session

---

## Stopping the Application

To stop the servers:

1. Go to each terminal window
2. Press `Ctrl + C`
3. Type `Y` if prompted

---

## Troubleshooting

### Problem: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/

### Problem: "Cannot find module"
**Solution**: Make sure you ran `npm install` in both backend AND frontend directories

### Problem: "Failed to upload and process PDF"
**Solutions**:
- ✅ Check that backend is running (see Terminal 1)
- ✅ Verify `.env` file has correct OpenAI API key
- ✅ Ensure your OpenAI account has API credits
- ✅ Check PDF file is not corrupted

### Problem: Backend won't start - "OPENAI_API_KEY is not defined"
**Solution**: Create the `.env` file in backend directory with your API key

### Problem: "Port 3000 is already in use"
**Solution**: 
- Close any other apps using port 3000
- Or change the port in `frontend/vite.config.js`

### Problem: "CORS Error"
**Solution**: Make sure BOTH servers are running (backend on 3001, frontend on 3000)

### Problem: "Invalid API Key"
**Solutions**:
- ✅ Double-check you copied the full API key from OpenAI
- ✅ Make sure there are no extra spaces in the `.env` file
- ✅ Verify your API key is active at https://platform.openai.com/api-keys

---

## Testing the Setup

To verify everything works:

1. **Backend Health Check**:
   Open browser to: http://localhost:3001/health
   Should see: `{"status":"ok","paperLoaded":false,"filename":""}`

2. **Frontend Loading**:
   Open browser to: http://localhost:3000
   Should see the upload interface

---

## Next Steps

- Try uploading a test PDF paper
- Ask questions like:
  - "What is the main contribution of this paper?"
  - "What methodology was used?"
  - "What are the key findings?"
  - "What are the limitations?"

---

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review the main [README.md](./README.md)
3. Verify both servers are running in their terminals
4. Check the browser console for errors (F12)

---

## Summary

✅ Backend installed and configured
✅ Frontend installed and configured  
✅ OpenAI API key set up
✅ Both servers running
✅ Application accessible at http://localhost:3000

**You're all set! Happy researching! 🎉📚**

