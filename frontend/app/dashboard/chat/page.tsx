"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Plus, Search, Phone, Video, MoreHorizontal } from "lucide-react"

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      content: "Hey, how's the project coming along?",
      time: "10:30 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      content: "Going well! Just finished the design mockups.",
      time: "10:32 AM",
      isMe: true,
    },
    {
      id: 3,
      sender: "John Doe",
      content: "Great! Can you share them in our next meeting?",
      time: "10:35 AM",
      isMe: false,
    },
  ])

  const contacts = [
    { name: "John Doe", status: "online", lastMessage: "Great! Can you share them...", time: "10:35 AM" },
    { name: "Sarah Wilson", status: "away", lastMessage: "Thanks for the update", time: "9:45 AM" },
    { name: "Mike Johnson", status: "offline", lastMessage: "See you tomorrow", time: "Yesterday" },
    { name: "Emily Davis", status: "online", lastMessage: "The design looks good", time: "2:30 PM" },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "Me",
          content: message,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: true,
        },
      ])
      setMessage("")
    }
  }

  return (
    <div className="flex h-full">
      {/* Contacts Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <Button size="icon" variant="ghost">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact, index) => (
            <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-600 text-white">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      contact.status === "online"
                        ? "bg-green-500"
                        : contact.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.time}</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-purple-600 text-white">JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">John Doe</h3>
                <p className="text-sm text-green-600">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="ghost">
                <Phone className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Video className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.isMe ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.isMe ? "text-purple-200" : "text-gray-500"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
