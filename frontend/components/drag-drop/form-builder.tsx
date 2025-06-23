"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Type,
  Hash,
  Mail,
  Calendar,
  ToggleLeft,
  List,
  FileText,
  Trash2,
  Settings,
  Sparkles,
  Eye,
  Save,
} from "lucide-react"

interface FormField {
  id: string
  type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "date"
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  aiSuggested?: boolean
}

const fieldTypes = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "number", label: "Number", icon: Hash },
  { type: "textarea", label: "Text Area", icon: FileText },
  { type: "select", label: "Dropdown", icon: List },
  { type: "checkbox", label: "Checkbox", icon: ToggleLeft },
  { type: "date", label: "Date", icon: Calendar },
]

export function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([
    {
      id: "1",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      id: "2",
      type: "email",
      label: "Email Address",
      placeholder: "your@email.com",
      required: true,
    },
  ])

  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [formTitle, setFormTitle] = useState("Contact Form")
  const [formDescription, setFormDescription] = useState("Please fill out this form to get in touch with us.")

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFields(items)
  }

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}...`,
      required: false,
      aiSuggested: true,
    }
    setFields([...fields, newField])
    setSelectedField(newField.id)
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
    if (selectedField === id) {
      setSelectedField(null)
    }
  }

  const generateAISuggestions = () => {
    // Mock AI suggestions
    const suggestions = [
      { type: "text", label: "Company Name", placeholder: "Your company name" },
      { type: "select", label: "Industry", options: ["Technology", "Healthcare", "Finance", "Education", "Other"] },
      { type: "textarea", label: "Message", placeholder: "Tell us about your needs..." },
    ]

    suggestions.forEach((suggestion) => {
      const newField: FormField = {
        id: Date.now().toString() + Math.random(),
        ...suggestion,
        required: false,
        aiSuggested: true,
      } as FormField
      setFields((prev) => [...prev, newField])
    })
  }

  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return <Input placeholder={field.placeholder} type={field.type} disabled />
      case "textarea":
        return <Textarea placeholder={field.placeholder} disabled className="min-h-[80px]" />
      case "select":
        return (
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" disabled>
            <option>Select an option...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input type="checkbox" disabled />
            <label className="text-sm">{field.placeholder || "Checkbox option"}</label>
          </div>
        )
      case "date":
        return <Input type="date" disabled />
      default:
        return null
    }
  }

  const selectedFieldData = fields.find((f) => f.id === selectedField)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]">
      {/* Field Types Palette */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm">Form Elements</CardTitle>
          <Button variant="outline" size="sm" onClick={generateAISuggestions} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Suggestions
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {fieldTypes.map((fieldType) => (
            <Button
              key={fieldType.type}
              variant="ghost"
              className="w-full justify-start h-auto p-3"
              onClick={() => addField(fieldType.type as FormField["type"])}
            >
              <fieldType.icon className="mr-2 h-4 w-4" />
              <span className="text-sm">{fieldType.label}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Form Builder */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-lg font-semibold border-none p-0 h-auto"
              />
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="text-sm text-muted-foreground border-none p-0 mt-1 min-h-[40px]"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="form-fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 min-h-[400px]">
                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 border rounded-lg bg-background ${
                            snapshot.isDragging ? "shadow-lg" : ""
                          } ${selectedField === field.id ? "ring-2 ring-primary" : ""}`}
                          onClick={() => setSelectedField(field.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div {...provided.dragHandleProps} className="cursor-grab p-1 hover:bg-muted rounded">
                                ⋮⋮
                              </div>
                              <Label className="font-medium">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              {field.aiSuggested && (
                                <Badge variant="secondary" className="text-xs">
                                  <Sparkles className="mr-1 h-3 w-3" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeField(field.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          {renderFieldPreview(field)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {fields.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Drag form elements here to build your form</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Field Properties */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Field Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedFieldData ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="field-label">Label</Label>
                <Input
                  id="field-label"
                  value={selectedFieldData.label}
                  onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="field-placeholder">Placeholder</Label>
                <Input
                  id="field-placeholder"
                  value={selectedFieldData.placeholder || ""}
                  onChange={(e) => updateField(selectedFieldData.id, { placeholder: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="field-required"
                  checked={selectedFieldData.required || false}
                  onChange={(e) => updateField(selectedFieldData.id, { required: e.target.checked })}
                />
                <Label htmlFor="field-required">Required field</Label>
              </div>

              {selectedFieldData.type === "select" && (
                <div>
                  <Label>Options</Label>
                  <Textarea
                    placeholder="Enter options, one per line"
                    value={selectedFieldData.options?.join("\n") || ""}
                    onChange={(e) =>
                      updateField(selectedFieldData.id, {
                        options: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a field to edit its properties</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
