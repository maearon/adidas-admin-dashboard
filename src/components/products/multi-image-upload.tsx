"use client"

import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { ImagePreview } from "@/components/ui/image-preview"

interface MultiImageUploadProps {
  value?: (File | string)[]
  onChange: (files: (File | string)[]) => void
  label: string
  maxFiles?: number
  accept?: string
  disabled?: boolean
}

export function MultiImageUpload({
  value = [],
  onChange,
  label,
  maxFiles = 10,
  accept = "image/*",
  disabled = false,
}: MultiImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    const newPreviews: string[] = []

    value.forEach((item) => {
      if (typeof item === "string") {
        newPreviews.push(item)
      } else if (item instanceof File) {
        const reader = new FileReader()
        reader.onload = () => {
          newPreviews.push(reader.result as string)
          setPreviews([...newPreviews])
        }
        reader.readAsDataURL(item)
      }
    })

    if (newPreviews.length > 0) {
      setPreviews(newPreviews)
    }
  }, [value])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = maxFiles - value.length
      const filesToAdd = acceptedFiles.slice(0, remainingSlots)
      onChange([...value, ...filesToAdd])
    },
    [value, onChange, maxFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    multiple: true,
    disabled: disabled || value.length >= maxFiles,
  })

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">{label}</label>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <ImagePreview
              key={index}
              src={preview || "/placeholder.svg"}
              alt={`${label} ${index + 1}`}
              onRemove={disabled ? undefined : () => handleRemove(index)}
            />
          ))}
        </div>
      )}

      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive ? "Drop images here" : `Click or drag images to upload (${value.length}/${maxFiles})`}
          </p>
        </div>
      )}
    </div>
  )
}
