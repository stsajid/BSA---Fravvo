"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, FileText, Sparkles, Download, Tag } from "lucide-react"

export function AIFileAnalyzer() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    // Process files
    console.log("Files dropped:", files)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            File & Feed Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop files here to analyze</p>
            <p className="text-sm text-muted-foreground mb-4">Supports PDF, DOC, TXT, images, and more</p>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
          </div>

          {/* Feed Reference */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Reference Feed Items</h4>
            <p className="text-sm text-muted-foreground mb-3">Select feed posts to include in analysis</p>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Browse Feed
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">document.pdf</span>
                  <Badge variant="secondary">Analyzed</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  AI Summary: This document contains project requirements and specifications...
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" />
                    project-spec
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" />
                    requirements
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-3 w-3" />
                    Export Summary
                  </Button>
                  <Button size="sm" variant="outline">
                    Create Task
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
