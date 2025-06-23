"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Upload, Sparkles, History, BarChart3, Wand2, Zap, Send, Check, X } from "lucide-react"
import { AIPromptHistory } from "./ai-prompt-history"
import { AIFileAnalyzer } from "./ai-file-analyzer"
import { AIDashboardGenerator } from "./ai-dashboard-generator"

const promptModes = [
  {
    id: "quick_ask",
    label: "Quick Ask",
    icon: Zap,
    description: "Get short, smart answers",
    color: "bg-blue-500",
  },
  {
    id: "dig",
    label: "Dig",
    icon: BarChart3,
    description: "Deep analysis and insights",
    color: "bg-green-500",
  },
  {
    id: "make",
    label: "Make",
    icon: Wand2,
    description: "Create forms, tasks, and docs",
    color: "bg-purple-500",
  },
]

interface AIResponse {
  type: "text" | "form" | "task" | "document"
  data: any
  preview?: string
  confirmation?: string
}

export function AIWorkspace() {
  const [activeTab, setActiveTab] = useState("create")
  const [prompt, setPrompt] = useState("")
  const [selectedMode, setSelectedMode] = useState("quick_ask")
  const [isProcessing, setIsProcessing] = useState(false)
  const [response, setResponse] = useState<string>("")
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    setIsProcessing(true)
    setResponse("")
    setAiResponse(null)
    setShowConfirmation(false)

    try {
      const res = await fetch("/api/fravvo-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mode: selectedMode,
          context: {
            page: "ai-workspace",
            timestamp: new Date().toISOString(),
          },
        }),
      })

      if (selectedMode === "make") {
        // Handle structured response for Make mode
        const data = await res.json()
        setAiResponse(data)
        if (data.confirmation) {
          setShowConfirmation(true)
        }
      } else {
        // Handle streaming response for Quick Ask and Dig modes
        const reader = res.body?.getReader()
        if (!reader) return

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const content = JSON.parse(line.slice(2))
                if (content.type === "text-delta") {
                  setResponse((prev) => prev + content.textDelta)
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("AI request failed:", error)
      setResponse("Sorry, I encountered an error processing your request. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmCreation = async () => {
    if (!aiResponse) return

    setIsProcessing(true)
    try {
      const res = await fetch("/api/fravvo-ai/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: aiResponse.type,
          data: aiResponse.data,
        }),
      })

      const result = await res.json()
      if (result.success) {
        setResponse(`✅ ${result.message}`)
        setShowConfirmation(false)
        setPrompt("")
      } else {
        setResponse(`❌ ${result.message}`)
      }
    } catch (error) {
      setResponse("❌ Failed to create item. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Fravvo AI</h1>
            <p className="text-muted-foreground">Your intelligent workspace assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Powered
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="create" className="gap-2">
            <Wand2 className="h-4 w-4" />
            Create
          </TabsTrigger>
          <TabsTrigger value="analyze" className="gap-2">
            <Upload className="h-4 w-4" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="workspace" className="gap-2">
            <Brain className="h-4 w-4" />
            Workspace
          </TabsTrigger>
        </TabsList>

        {/* AI Assistant */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Fravvo AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mode Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">AI Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      {promptModes.map((mode) => (
                        <Button
                          key={mode.id}
                          variant={selectedMode === mode.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedMode(mode.id)}
                          className="justify-start gap-2 h-auto p-3 flex-col items-start"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div className={`w-2 h-2 rounded-full ${mode.color}`} />
                            <mode.icon className="h-4 w-4" />
                            <span className="font-medium">{mode.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground text-left">{mode.description}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Prompt Input */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">What can I help you with?</label>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder={
                          selectedMode === "quick_ask"
                            ? "Ask me anything... e.g., 'What's our leave policy?'"
                            : selectedMode === "dig"
                              ? "Let's analyze... e.g., 'Compare team performance this quarter'"
                              : "Let's create... e.g., 'Make a leave application form'"
                        }
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[100px] flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                            handleSubmit()
                          }
                        }}
                      />
                      <Button onClick={handleSubmit} disabled={!prompt.trim() || isProcessing} className="self-end">
                        {isProcessing ? <Sparkles className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Press Cmd/Ctrl + Enter to send</p>
                  </div>
                </CardContent>
              </Card>

              {/* AI Response */}
              {(response || aiResponse || isProcessing) && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      AI Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isProcessing && !response && !aiResponse && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        Processing your request...
                      </div>
                    )}

                    {response && (
                      <ScrollArea className="max-h-[400px] w-full rounded-md border p-4">
                        <pre className="whitespace-pre-wrap text-sm">{response}</pre>
                      </ScrollArea>
                    )}

                    {aiResponse && (
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="font-medium">{aiResponse.preview}</p>
                          {aiResponse.type === "form" && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p>Fields: {aiResponse.data.fields?.map((f: any) => f.label).join(", ")}</p>
                            </div>
                          )}
                          {aiResponse.type === "task" && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p>Priority: {aiResponse.data.priority}</p>
                              {aiResponse.data.due_date && <p>Due: {aiResponse.data.due_date}</p>}
                            </div>
                          )}
                        </div>

                        {showConfirmation && aiResponse.confirmation && (
                          <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                            <p className="flex-1">{aiResponse.confirmation}</p>
                            <Button size="sm" onClick={handleConfirmCreation} disabled={isProcessing}>
                              <Check className="h-4 w-4 mr-1" />
                              Yes, Create
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setShowConfirmation(false)}>
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Example Prompts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-600">Quick Ask</p>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setPrompt("What's our team's current workload?")}
                    >
                      <span className="text-sm">What's our team's current workload?</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-600">Dig</p>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setPrompt("Analyze our project completion rates")}
                    >
                      <span className="text-sm">Analyze our project completion rates</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-600">Make</p>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setPrompt("Create a team feedback form")}
                    >
                      <span className="text-sm">Create a team feedback form</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Other tabs remain the same */}
        <TabsContent value="analyze">
          <AIFileAnalyzer />
        </TabsContent>

        <TabsContent value="dashboard">
          <AIDashboardGenerator />
        </TabsContent>

        <TabsContent value="history">
          <AIPromptHistory />
        </TabsContent>

        <TabsContent value="workspace">
          <Card>
            <CardHeader>
              <CardTitle>Project-Based AI Workspace</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Each project maintains its own AI context and memory for better assistance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
