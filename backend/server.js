import express from "express";
import cors from "cors";
import multer from "multer";
import pdfParse from "pdf-parse-fork";
import OpenAI from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize OpenAI
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory storage for paper text
let paperContext = {
  text: "",
  filename: "",
};

// Route 1: Upload PDF and generate summary
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Processing PDF:", req.file.originalname);

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;

    // Store in memory
    paperContext.text = extractedText;
    paperContext.filename = req.file.originalname;

    console.log("Text extracted, length:", extractedText.length);

    // Create prompt for OpenAI
    const prompt = `You are a research paper summarization assistant. Analyze the following research paper and provide:

IMPORTANT: Start your response with the paper title on the first line in this exact format:
TITLE: [Exact title of the paper]

Then provide:

1. A comprehensive full summary (2-3 paragraphs)
2. Five key bullet points highlighting the main contributions
3. Section-wise summaries:
   - Introduction: What is the problem and motivation?
   - Methods: What approach/methodology was used?
   - Results: What were the main findings?
   - Conclusion: What are the implications and future work?

Format your response clearly with headers for each section.

Research Paper:
${extractedText.substring(0, 12000)}`; // Limit to avoid token limits

    console.log("Calling OpenAI API...");

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert research paper analyst. Provide clear, concise, and accurate summaries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const summary = completion.choices[0].message.content;

    console.log("Summary generated successfully");

    res.json({
      success: true,
      filename: req.file.originalname,
      summary: summary,
      textLength: extractedText.length,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({
      error: "Failed to process PDF",
      message: error.message,
    });
  }
});

// Route 2: Q&A about the paper
app.post("/qa", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    if (!paperContext.text) {
      return res.status(400).json({
        error: "No paper uploaded yet. Please upload a PDF first.",
      });
    }

    console.log("Processing question:", question);

    // Create prompt with paper context
    const prompt = `Based on the following research paper, answer this question clearly and concisely:

Question: ${question}

Research Paper:
${paperContext.text.substring(0, 10000)}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful research assistant. Answer questions about the research paper accurately and concisely.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const answer = completion.choices[0].message.content;

    console.log("Answer generated successfully");

    res.json({
      success: true,
      question: question,
      answer: answer,
    });
  } catch (error) {
    console.error("Error processing question:", error);
    res.status(500).json({
      error: "Failed to process question",
      message: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    paperLoaded: !!paperContext.text,
    filename: paperContext.filename,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Upload endpoint: POST http://localhost:${PORT}/upload`);
  console.log(`💬 Q&A endpoint: POST http://localhost:${PORT}/qa`);
});
