import { useState, useRef } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Send, FileText, Loader2 } from 'lucide-react'

const API_URL = 'https://papersnap.onrender.com/'

function App() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [summary, setSummary] = useState(null)
  const [filename, setFilename] = useState('')
  const [question, setQuestion] = useState('')
  const [qaHistory, setQaHistory] = useState([])
  const [askingQuestion, setAskingQuestion] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      alert('Please select a valid PDF file')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a PDF file first')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setSummary(response.data.summary)
      setFilename(response.data.filename)
      setQaHistory([])
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload and process PDF. Please check if the backend is running.')
    } finally {
      setUploading(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      return
    }

    if (!summary) {
      alert('Please upload a PDF first')
      return
    }

    setAskingQuestion(true)

    try {
      const response = await axios.post(`${API_URL}/qa`, {
        question: question,
      })

      setQaHistory([
        ...qaHistory,
        {
          question: question,
          answer: response.data.answer,
        },
      ])
      setQuestion('')
    } catch (error) {
      console.error('Error asking question:', error)
      alert('Failed to get answer. Please try again.')
    } finally {
      setAskingQuestion(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !askingQuestion) {
      handleAskQuestion()
    }
  }

  const parseSummary = (summaryText) => {
    // Simple parsing logic to display the summary in a structured way
    const sections = summaryText.split('\n\n')
    return sections
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Research Paper Summarizer</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-180px)]">
          {/* Left Column - Upload Section (30%) */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Welcome!</CardTitle>
                <CardDescription>
                  Upload your research paper PDF to get started with AI-powered analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="application/pdf"
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="mb-2"
                    >
                      Select PDF File
                    </Button>
                    {file && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: <span className="font-medium">{file.name}</span>
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full"
                    size="lg"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Get Started / Upload Paper'
                    )}
                  </Button>
                </div>

                <div className="pt-6 border-t space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700">What you'll get:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Full comprehensive summary</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>5 key bullet points</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Section-wise analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Interactive Q&A about the paper</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Q&A Section (70%) */}
          <div className="lg:col-span-2">
            {!summary ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-20">
                  <FileText className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Paper Uploaded Yet
                  </h3>
                  <p className="text-gray-500">
                    Upload a research paper to see the AI-generated summary and analysis
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Generated Summary</CardTitle>
                    <CardDescription>Analysis of: {filename}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none space-y-4">
                      {parseSummary(summary).map((section, index) => (
                        <div key={index} className="text-gray-700 whitespace-pre-wrap">
                          {section}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Q&A Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ask Questions</CardTitle>
                    <CardDescription>
                      Ask any question about the research paper
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Q&A History */}
                    {qaHistory.length > 0 && (
                      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                        {qaHistory.map((qa, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="mb-3">
                              <p className="font-semibold text-gray-900 mb-1">Q: {qa.question}</p>
                            </div>
                            <div className="pl-4 border-l-2 border-primary">
                              <p className="text-gray-700 whitespace-pre-wrap">
                                <span className="font-semibold text-primary">A:</span> {qa.answer}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Question Input */}
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Type your question here..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={askingQuestion}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAskQuestion}
                        disabled={!question.trim() || askingQuestion}
                        size="lg"
                      >
                        {askingQuestion ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Ask
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

