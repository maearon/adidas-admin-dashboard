"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GripVertical, Plus, Trash2, Save, AlertCircle, CheckCircle2, Code2 } from "lucide-react"
import { toast } from "react-toastify"
import api from "@/api/client"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export type SectionType = "reviews" | "description" | "details" | "highlights"

export interface SectionOrder {
  type: SectionType
  enabled: boolean
  order: number
}

export interface TranslationData {
  description?: {
    descTitle?: string
    descText?: string
  }
  details?: string[]
  highlights?: Array<{ title: string; text: string }>
  sectionOrder?: SectionOrder[]
}

interface ProductTranslationsEditorProps {
  /** variant_code, ví dụ JP5593 */
  productId: number | string
  locale: string
  initialData?: TranslationData
  onSaved?: (data: TranslationData) => void
  onCancel?: () => void
}

const DEFAULT_SECTION_ORDER: SectionOrder[] = [
  { type: "reviews", enabled: true, order: 0 },
  { type: "description", enabled: true, order: 1 },
  { type: "details", enabled: true, order: 2 },
  { type: "highlights", enabled: true, order: 3 },
]

const SECTION_LABELS: Record<SectionType, string> = {
  reviews: "Reviews",
  description: "Description",
  details: "Details",
  highlights: "Highlights",
}

function SortableSectionItem({
  section,
  onToggle,
  index,
}: {
  section: SectionOrder
  onToggle: () => void
  index: number
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.type,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 border rounded-lg bg-background ${
        !section.enabled ? "opacity-50" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1 flex items-center gap-3">
        <span className="font-medium">{index + 1}.</span>
        <span className="font-semibold">{SECTION_LABELS[section.type]}</span>
        <Badge variant={section.enabled ? "default" : "secondary"}>
          {section.enabled ? "Enabled" : "Disabled"}
        </Badge>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="text-xs"
      >
        {section.enabled ? "Disable" : "Enable"}
      </Button>
    </div>
  )
}

export function ProductTranslationsEditor({
  productId,
  locale,
  initialData,
  onSaved,
  onCancel,
}: ProductTranslationsEditorProps) {
  const [data, setData] = useState<TranslationData>(
    initialData || {
      description: { descTitle: "", descText: "" },
      details: [],
      highlights: [],
      sectionOrder: [...DEFAULT_SECTION_ORDER],
    }
  )
  const [jsonMode, setJsonMode] = useState(false)
  const [jsonText, setJsonText] = useState("")
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    setJsonText(JSON.stringify(data, null, 2))
  }, [data])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = data.sectionOrder?.findIndex((s) => s.type === active.id) ?? -1
    const newIndex = data.sectionOrder?.findIndex((s) => s.type === over.id) ?? -1

    if (oldIndex !== -1 && newIndex !== -1 && data.sectionOrder) {
      const newOrder = arrayMove(data.sectionOrder, oldIndex, newIndex)
      // Update order numbers
      const updatedOrder = newOrder.map((section, index) => ({
        ...section,
        order: index,
      }))
      setData({ ...data, sectionOrder: updatedOrder })
    }
  }

  const toggleSection = (type: SectionType) => {
    if (!data.sectionOrder) return
    setData({
      ...data,
      sectionOrder: data.sectionOrder.map((s) =>
        s.type === type ? { ...s, enabled: !s.enabled } : s
      ),
    })
  }

  const addDetail = () => {
    setData({
      ...data,
      details: [...(data.details || []), ""],
    })
  }

  const updateDetail = (index: number, value: string) => {
    if (!data.details) return
    const newDetails = [...data.details]
    newDetails[index] = value
    setData({ ...data, details: newDetails })
  }

  const removeDetail = (index: number) => {
    if (!data.details) return
    setData({
      ...data,
      details: data.details.filter((_, i) => i !== index),
    })
  }

  const addHighlight = () => {
    setData({
      ...data,
      highlights: [...(data.highlights || []), { title: "", text: "" }],
    })
  }

  const updateHighlight = (index: number, field: "title" | "text", value: string) => {
    if (!data.highlights) return
    const newHighlights = [...data.highlights]
    newHighlights[index] = { ...newHighlights[index], [field]: value }
    setData({ ...data, highlights: newHighlights })
  }

  const removeHighlight = (index: number) => {
    if (!data.highlights) return
    setData({
      ...data,
      highlights: data.highlights.filter((_, i) => i !== index),
    })
  }

  const validateJson = (jsonString: string): TranslationData | null => {
    try {
      const parsed = JSON.parse(jsonString)
      
      // Validate structure
      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("Data must be an object")
      }

      // Validate sectionOrder if present
      if (parsed.sectionOrder) {
        if (!Array.isArray(parsed.sectionOrder)) {
          throw new Error("sectionOrder must be an array")
        }
        const validTypes: SectionType[] = ["reviews", "description", "details", "highlights"]
        for (const section of parsed.sectionOrder) {
          if (!validTypes.includes(section.type)) {
            throw new Error(`Invalid section type: ${section.type}`)
          }
          if (typeof section.enabled !== "boolean") {
            throw new Error("section.enabled must be a boolean")
          }
          if (typeof section.order !== "number") {
            throw new Error("section.order must be a number")
          }
        }
      }

      // Validate highlights if present
      if (parsed.highlights) {
        if (!Array.isArray(parsed.highlights)) {
          throw new Error("highlights must be an array")
        }
        for (const highlight of parsed.highlights) {
          if (!highlight.title || !highlight.text) {
            throw new Error("Each highlight must have title and text")
          }
        }
      }

      // Validate details if present
      if (parsed.details && !Array.isArray(parsed.details)) {
        throw new Error("details must be an array")
      }

      return parsed as TranslationData
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid JSON")
      return null
    }
  }

  const handleJsonChange = (value: string) => {
    setJsonText(value)
    setJsonError(null)
    const validated = validateJson(value)
    if (validated) {
      setData(validated)
    }
  }

  const handleSave = async () => {
    let dataToSave = data

    if (jsonMode) {
      const validated = validateJson(jsonText)
      if (!validated) {
        toast.error("Please fix JSON errors before saving")
        return
      }
      dataToSave = validated
      setData(validated)
    }

    if (!dataToSave.sectionOrder || dataToSave.sectionOrder.length === 0) {
      dataToSave = { ...dataToSave, sectionOrder: [...DEFAULT_SECTION_ORDER] }
      setData(dataToSave)
    }

    const payload: TranslationData = {
      ...dataToSave,
      details: dataToSave.details?.filter((d) => d.trim() !== "") ?? [],
      highlights:
        dataToSave.highlights?.filter((h) => h.title.trim() || h.text.trim()) ?? [],
    }

    setIsSaving(true)
    try {
      const { data: result } = await api.post<{ success: boolean; message?: string }>(
        `/api/admin/products/${productId}/update_translations`,
        { locale, data: payload }
      )

      if (!result?.success) {
        throw new Error(result?.message || "Failed to save translation")
      }

      onSaved?.(payload)
      toast.success(`Translation ${locale.toUpperCase()} saved to database`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save translation")
    } finally {
      setIsSaving(false)
    }
  }

  const enabledSections = data.sectionOrder?.filter((s) => s.enabled) || []
  const sortedSections = [...(data.sectionOrder || DEFAULT_SECTION_ORDER)].sort(
    (a, b) => a.order - b.order
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Product Translations ({locale.toUpperCase()})</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setJsonMode(!jsonMode)
                setJsonError(null)
              }}
            >
              <Code2 className="h-4 w-4 mr-2" />
              {jsonMode ? "Form Mode" : "JSON Mode"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="button" size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {jsonMode ? (
          <div className="space-y-2">
            <Label>JSON Editor</Label>
            <Textarea
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="font-mono text-sm min-h-[400px]"
              placeholder='{"description": {...}, "details": [...], "highlights": [...], "sectionOrder": [...]}'
            />
            {jsonError ? (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{jsonError}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>Valid JSON</span>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Section Order */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Section Order</Label>
                <Badge variant="outline">{enabledSections.length} enabled</Badge>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortedSections.map((s) => s.type)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {sortedSections.map((section, index) => (
                      <SortableSectionItem
                        key={section.type}
                        section={section}
                        onToggle={() => toggleSection(section.type)}
                        index={index}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Description</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="descTitle">Title</Label>
                  <Input
                    id="descTitle"
                    value={data.description?.descTitle || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        description: { ...data.description, descTitle: e.target.value },
                      })
                    }
                    placeholder="Description title"
                  />
                </div>
                <div>
                  <Label htmlFor="descText">Text</Label>
                  <Textarea
                    id="descText"
                    value={data.description?.descText || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        description: { ...data.description, descText: e.target.value },
                      })
                    }
                    placeholder="Description text"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Details</Label>
                <Button type="button" variant="outline" size="sm" onClick={addDetail}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Detail
                </Button>
              </div>
              <div className="space-y-2">
                {(data.details || []).map((detail, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={detail}
                      onChange={(e) => updateDetail(index, e.target.value)}
                      placeholder={`Detail ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDetail(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Highlights */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Highlights</Label>
                <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Highlight
                </Button>
              </div>
              <div className="space-y-4">
                {(data.highlights || []).map((highlight, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Highlight {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHighlight(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={highlight.title}
                        onChange={(e) => updateHighlight(index, "title", e.target.value)}
                        placeholder="Title"
                      />
                      <Textarea
                        value={highlight.text}
                        onChange={(e) => updateHighlight(index, "text", e.target.value)}
                        placeholder="Text"
                        rows={3}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

