"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MainAppLayout } from "@/components/layout/main-app-layout"
import { Sparkles, Microscope, PlusCircle, Paperclip, AtSign, ArrowUp, ChevronDown } from "lucide-react"

export default function FravvoAI() {
  const [promptInput, setPromptInput] = useState<string>("")

  return (
    <MainAppLayout title="Fravvo AI" description="Manage users, roles and permission across your organization">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Title Section */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
            <Image src="/fravvo_ai_icon.svg" alt="Your Fravvo Brain" width={32} height={32} className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Your Fravvo Brain</h1>
        </div>

        {/* Fravvo AI Input Section */}
        <div className="w-full max-w-4xl bg-white rounded-2xl p-6 shadow-sm">
          <div className="relative mb-4">
            <Input
              placeholder="Ask Fravvo AI anything... Try /search, /summarize, or /generate"
              className="w-full h-16 pl-6 pr-6 text-lg border-gray-300 rounded-xl shadow-sm bg-white"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Quick Ask</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Search</DropdownMenuItem>
                  <DropdownMenuItem>Summarize</DropdownMenuItem>
                  <DropdownMenuItem>Generate</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white transition-colors duration-200"
              >
                <Microscope className="w-4 h-4" />
                <span>Dig</span>
              </Button>

              <Button
                variant="ghost"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white transition-colors duration-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Make</span>
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-40 rounded-lg bg-gray-100 hover:bg-white transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <Image src="/icon_fravvo.svg" alt="All sources" width={16} height={16} className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                <AtSign className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                className={`rounded-full transition-colors duration-200 ${
                  promptInput.length > 0
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainAppLayout>
  )
}
