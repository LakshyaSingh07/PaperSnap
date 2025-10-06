# Research Paper Summarizer 📚

A full-stack web application that uses AI to summarize research papers and answer questions about them.

## Features ✨

- **PDF Upload**: Upload research papers in PDF format
- **AI-Powered Summary**: Get comprehensive summaries including:
  - Full summary (2-3 paragraphs)
  - 5 key bullet points
  - Section-wise analysis (Intro, Methods, Results, Conclusion)
- **Interactive Q&A**: Ask questions about the paper and get instant AI-generated answers
- **Modern UI**: Beautiful, responsive interface built with React, Tailwind CSS, and shadcn/ui
- **Real-time Processing**: Immediate feedback with loading states

## Tech Stack 🛠️

### Frontend
- **React** (v18.2) - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **pdf-parse-fork** - PDF text extraction
- **OpenRouter API (gpt-4o-mini)** - AI summarization and Q&A via OpenRouter
- **Multer** - File upload handling

## Prerequisites 📋

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **OpenRouter API Key** - Get one at [openrouter.ai/keys](https://openrouter.ai/keys)
  - Note: This project uses OpenRouter to access OpenAI's gpt-4o-mini model

## Installation & Setup 🚀

### 1. Clone or Download the Project

```bash
cd ResearchPaperSummary
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Create a file named .env in the backend directory with:
# OPENAI_API_KEY=your_openrouter_api_key_here
# PORT=3001

# Note: Replace 'your_openrouter_api_key_here' with your actual OpenRouter API key
# Get your key at: https://openrouter.ai/keys
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## Running the Application 🏃

You need to run both the backend and frontend servers.

### Terminal 1 - Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3001`

### Terminal 2 - Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## Usage 📖

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Upload a PDF**:
   - Click "Select PDF File" on the left panel
   - Choose a research paper PDF from your computer
   - Click "Get Started / Upload Paper"
   - Wait for the AI to process (usually 10-30 seconds)

3. **View Summary**:
   - The AI-generated summary will appear on the right panel
   - Includes full summary, key points, and section-wise analysis

4. **Ask Questions**:
   - Type your question in the input field at the bottom
   - Click "Ask" or press Enter
   - View the answer immediately
   - All Q&A exchanges are saved in the history during the session

## Project Structure 📁

```
ResearchPaperSummary/
├── backend/
│   ├── server.js           # Express server with /upload and /qa routes
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── lib/
│   │   │   └── utils.js   # Utility functions
│   │   ├── App.jsx        # Main application component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## API Endpoints 🔌

### POST /upload
- **Description**: Upload and process a PDF file
- **Body**: FormData with 'file' field containing PDF
- **Response**: 
  ```json
  {
    "success": true,
    "filename": "paper.pdf",
    "summary": "AI-generated summary...",
    "textLength": 12543
  }
  ```

### POST /qa
- **Description**: Ask a question about the uploaded paper
- **Body**: 
  ```json
  {
    "question": "What are the main findings?"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "question": "What are the main findings?",
    "answer": "The main findings are..."
  }
  ```

### GET /health
- **Description**: Check server status
- **Response**:
  ```json
  {
    "status": "ok",
    "paperLoaded": true,
    "filename": "paper.pdf"
  }
  ```

## Configuration ⚙️

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
OPENAI_API_KEY=sk-your-api-key-here
PORT=3001
```

### Frontend API URL

The frontend is configured to connect to `http://localhost:3001` by default. To change this, edit the `API_URL` constant in `frontend/src/App.jsx`.

## Known Limitations ⚠️

- **In-Memory Storage**: Paper text is stored in server memory. Restarting the server will clear the data.
- **Single User**: The app currently supports one paper at a time (per server instance).
- **Token Limits**: Very long papers (>50 pages) may exceed OpenAI token limits. The app uses the first ~12,000 characters for summarization.
- **No Authentication**: This is an MVP without user authentication.

## Troubleshooting 🔧

### "Failed to upload and process PDF"
- Ensure the backend server is running on port 3001
- Check that your OpenAI API key is valid in the `.env` file
- Verify the PDF is not corrupted

### "CORS Error"
- Make sure both frontend and backend are running
- Check that the API_URL in `App.jsx` matches your backend URL

### OpenAI API Errors
- Verify your API key has sufficient credits
- Check your OpenAI account status at platform.openai.com

## Production Deployment 🚀

For production deployment:

1. **Backend**:
   - Set environment variables on your hosting platform
   - Use a process manager like PM2
   - Consider adding a database for persistent storage

2. **Frontend**:
   ```bash
   cd frontend
   npm run build
   # Deploy the 'dist' folder to your static hosting service
   ```

3. **Recommended Platforms**:
   - Frontend: Vercel, Netlify, or Cloudflare Pages
   - Backend: Railway, Render, or AWS EC2

## Future Enhancements 🎯

- [ ] Database integration for persistent storage
- [ ] Multiple paper support per user
- [ ] User authentication and sessions
- [ ] Export summaries as PDF/Markdown
- [ ] Support for DOI/arXiv URL input
- [ ] Citation extraction
- [ ] Comparison between multiple papers

## License 📄

MIT License - Feel free to use this project for learning and development.

## Support 💬

For issues, questions, or contributions, please open an issue in the repository.

---

**Built with ❤️ using React, Node.js, and OpenAI**

