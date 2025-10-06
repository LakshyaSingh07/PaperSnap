import { useState, useRef } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Send, FileText, Loader2, Sparkles, CheckCircle2, Brain } from 'lucide-react'

const API_URL = 'https://papersnap.onrender.com'

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

  // Function to extract title from summary
  const extractTitle = (summaryText) => {
    const lines = summaryText.split('\n').filter(line => line.trim() !== '')
    
    // First try to find explicit TITLE: format
    const titleLine = lines.find(line => line.startsWith('TITLE:'))
    if (titleLine) {
      return titleLine.replace('TITLE:', '').trim()
    }
    
    // Fallback: Use the first substantial line that's not a header marker
    // and is longer than 20 characters
    const firstLine = lines.find(line => {
      const trimmed = line.trim()
      return trimmed.length > 20 && 
             !trimmed.startsWith('#') && 
             !trimmed.startsWith('Comprehensive') &&
             !trimmed.startsWith('Section-wise')
    })
    
    if (firstLine && firstLine.length < 200) {
      return firstLine.trim()
    }
    
    return null
  }

  // Function to remove title from summary text
  const removeTitleFromSummary = (summaryText) => {
    const extractedTitle = extractTitle(summaryText)
    if (!extractedTitle) return summaryText
    
    const lines = summaryText.split('\n')
    
    // Remove TITLE: line if exists
    let filteredLines = lines.filter(line => !line.startsWith('TITLE:'))
    
    // Also remove the extracted title line if it was used
    filteredLines = filteredLines.filter(line => line.trim() !== extractedTitle)
    
    return filteredLines.join('\n')
  }

  // Function to render markdown-like text with proper formatting
  const renderFormattedText = (text) => {
    const lines = text.split('\n')
    
    return lines.map((line, index) => {
      // Handle headers (# Header) - check from most specific to least
      if (line.startsWith('#### ')) {
        return (
          <h4 key={index} className="text-base font-bold text-gray-900 mt-3 mb-2">
            {line.replace('#### ', '')}
          </h4>
        )
      } else if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-bold text-gray-900 mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        )
      } else if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold text-gray-900 mt-5 mb-3">
            {line.replace('## ', '')}
          </h2>
        )
      } else if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mt-6 mb-3">
            {line.replace('# ', '')}
          </h1>
        )
      }
      
      // Handle bullet points
      else if (line.startsWith('- ')) {
        const content = line.replace('- ', '')
        return (
          <li key={index} className="ml-4 mb-2 text-gray-700 leading-relaxed list-disc list-inside">
            {formatInlineMarkdown(content)}
          </li>
        )
      }
      
      // Handle numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, '')
        return (
          <li key={index} className="ml-4 mb-2 text-gray-700 leading-relaxed list-decimal list-inside">
            {formatInlineMarkdown(content)}
          </li>
        )
      }
      
      // Empty lines
      else if (line.trim() === '') {
        return <div key={index} className="h-2"></div>
      }
      
      // Regular paragraphs
      else {
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-2">
            {formatInlineMarkdown(line)}
          </p>
        )
      }
    })
  }

  // Function to format inline markdown (bold text only)
  const formatInlineMarkdown = (text) => {
    const parts = []
    let currentIndex = 0
    
    // Match **bold** text
    const boldRegex = /\*\*(.+?)\*\*/g
    let match
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index))
      }
      // Add bold text
      parts.push(
        <strong key={match.index} className="font-semibold text-gray-900">
          {match[1]}
        </strong>
      )
      currentIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex))
    }
    
    return parts.length > 0 ? parts : text
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative glass-effect border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            {/* Left side - Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0">
                {/* Desktop title */}
                <h1 className="hidden sm:block text-xl lg:text-2xl font-bold gradient-text">
                  PaperSnap | Research Paper Summarizer
                </h1>
                {/* Mobile title */}
                <h1 className="sm:hidden text-lg font-bold gradient-text">
                  PaperSnap
                </h1>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">AI-Powered Analysis</span>
                </p>
              </div>
            </div>
            
            {/* Right side - Author Link */}
            <div className="flex items-center flex-shrink-0">
              {/* Desktop version */}
              <a 
                href="https://lakshyasingh.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 hover:bg-white border border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 whitespace-nowrap">
                  Created by <span className="font-semibold">Lakshya Singh</span>
                </span>
                <svg 
                  className="w-4 h-4 text-gray-500 group-hover:text-purple-600 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              {/* Mobile/Tablet version - Compact with name */}
              <a 
                href="https://lakshyasingh.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/80 hover:bg-white border border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <span className="text-xs font-semibold text-gray-700 group-hover:text-purple-600 whitespace-nowrap">
                  Lakshya Singh
                </span>
                <svg 
                  className="w-3.5 h-3.5 text-gray-500 group-hover:text-purple-600 transition-colors flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-180px)]">
          {/* Left Column - Upload Section (30%) */}
          <div className="lg:col-span-1 animate-slide-up">
            <Card className="h-full glass-effect border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Welcome!
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Upload your research paper PDF to unlock AI-powered insights and analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="group border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-300 cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
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
                        className="mb-2 border-purple-300 hover:bg-purple-50 hover:border-purple-500"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Select PDF File
                      </Button>
                      {file && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                          <p className="text-sm text-green-700 flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold"
                    size="lg"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing Magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyze Paper
                      </>
                    )}
                  </Button>
                </div>

                <div className="pt-6 border-t border-purple-100 space-y-3">
                  <h3 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    What you'll discover:
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>Comprehensive AI summary</span>
                    </li>
                    <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>5 key insights & contributions</span>
                    </li>
                    <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>Section-wise deep analysis</span>
                    </li>
                    <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>Interactive Q&A assistant</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Q&A Section (70%) */}
          <div className="lg:col-span-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
            {!summary ? (
              <Card className="h-full flex items-center justify-center glass-effect border-white/40 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/20 to-blue-100/20"></div>
                <CardContent className="text-center py-20 relative z-10">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <FileText className="w-24 h-24 mx-auto text-purple-300 relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    Ready to Analyze
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Upload a research paper to unlock AI-powered summaries, insights, and interactive Q&A
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>AI Ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>Fast Processing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className="glass-effect border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-fade-in">
                  <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          AI-Generated Summary
                        </CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">{filename}</span>
                        </CardDescription>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Analyzed
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="max-w-none space-y-6">
                      {/* Paper Title */}
                      {extractTitle(summary) && (
                        <div className="p-6 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-xl border-2 border-purple-200/50">
                          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 leading-tight">
                            {extractTitle(summary)}
                          </h2>
                        </div>
                      )}
                      
                      {/* Summary Content */}
                      <div className="p-6 bg-gradient-to-br from-white/60 to-purple-50/30 rounded-xl border border-purple-100/50 hover:border-purple-200 transition-colors">
                        {renderFormattedText(removeTitleFromSummary(summary))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Q&A Section */}
                <Card className="glass-effect border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <Send className="w-5 h-5 text-white" />
                      </div>
                      Ask Questions
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Get instant answers from AI about the research paper
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    {/* Q&A History */}
                    {qaHistory.length > 0 && (
                      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                        {qaHistory.map((qa, index) => (
                          <div key={index} className="group border border-purple-200 rounded-xl p-5 bg-gradient-to-br from-white/80 to-purple-50/40 hover:shadow-lg transition-all duration-300 animate-fade-in">
                            <div className="mb-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">Q</span>
                                </div>
                                <p className="font-semibold text-gray-900 flex-1 pt-1">{qa.question}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 pl-3 border-l-4 border-gradient-to-b from-purple-500 to-pink-500 ml-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                              </div>
                              <div className="text-gray-700 leading-relaxed flex-1 pt-1">
                                {renderFormattedText(qa.answer)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Question Input */}
                    <div className="flex gap-3 p-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-200/50">
                      <Input
                        type="text"
                        placeholder="Ask anything about the paper..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={askingQuestion}
                        className="flex-1 border-purple-200 focus:border-purple-400 bg-white/80"
                      />
                      <Button
                        onClick={handleAskQuestion}
                        disabled={!question.trim() || askingQuestion}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {askingQuestion ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
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

      {/* Footer */}
      <footer className="relative glass-effect border-t border-white/30 shadow-lg mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-5 lg:gap-6">
            {/* Left side - Branding */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold gradient-text">PaperSnap</p>
                <p className="text-[10px] sm:text-xs text-gray-600">AI-Powered Research Assistant</p>
              </div>
            </div>

            {/* Center - Copyright & Made with Love */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base text-gray-600 text-center">
              <span>© {new Date().getFullYear()}</span>
              <span className="text-purple-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
                <span className="whitespace-nowrap">Made with <span className="animate-heartbeat">❤️</span> by</span>
                <span className="font-semibold text-gray-700">Lakshya Singh</span>
              </span>
              <span className="text-purple-300 hidden sm:inline">•</span>
              <span className="text-gray-500 w-full sm:w-auto mt-1 sm:mt-0">All Rights Reserved</span>
            </div>

            {/* Right side - Portfolio Link */}
            <div className="flex items-center">
              <a
                href="https://lakshyasingh.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-lg bg-white/60 hover:bg-white border border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <svg 
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-purple-600 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-purple-600">
                  Portfolio
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

