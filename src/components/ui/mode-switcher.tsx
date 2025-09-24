"use client"

import { Eye, Edit, Plus } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type Mode = "view" | "edit" | "create"

interface ModeSwitcherProps {
  mode: Mode
  onModeChange: (mode: Mode) => void
  disabled?: boolean
}

export function ModeSwitcher({ mode, onModeChange, disabled }: ModeSwitcherProps) {
  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => value && onModeChange(value as Mode)}
      disabled={disabled}
      className="justify-start"
    >
      <ToggleGroupItem value="view" aria-label="View mode">
        <Eye className="h-4 w-4 mr-2" />
        View
      </ToggleGroupItem>
      <ToggleGroupItem value="edit" aria-label="Edit mode">
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </ToggleGroupItem>
      <ToggleGroupItem value="create" aria-label="Create mode">
        <Plus className="h-4 w-4 mr-2" />
        Create
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
