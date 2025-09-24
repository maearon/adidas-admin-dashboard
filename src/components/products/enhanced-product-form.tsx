"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ModeSwitcher, type Mode } from "@/components/ui/mode-switcher"
import { ImageUploadField } from "./image-upload-field"
import { MultiImageUpload } from "./multi-image-upload"
import { productSchema, type ProductFormData } from "@/lib/validations/product"

interface EnhancedProductFormProps {
  initialData?: ProductFormData
  onSubmit: (data: ProductFormData) => Promise<void>
  mode?: Mode
}

export function EnhancedProductForm({ initialData, onSubmit, mode: initialMode = "create" }: EnhancedProductFormProps) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      category: "",
      sport: "",
      brand: "Adidas",
      status: "draft",
      variants: [
        {
          variant_code: "",
          size: "",
          color: "",
          price: 0,
          stock_quantity: 0,
          sku: "",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  })

  const watchName = watch("name")

  // Auto-generate slug from name
  useEffect(() => {
    if (watchName && mode === "create") {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setValue("slug", slug)
    }
  }, [watchName, setValue, mode])

  const handleFormSubmit = async (data: ProductFormData) => {
    if (mode === "view") return

    setIsSubmitting(true)
    try {
      await onSubmit(data)
      if (mode === "create") {
        reset()
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isReadOnly = mode === "view"

  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-400">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {mode === "create" ? "Create Product" : mode === "edit" ? "Edit Product" : "Product Details"}
        </h1>
        <ModeSwitcher mode={mode} onModeChange={setMode} />
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" {...register("name")} disabled={isReadOnly} placeholder="Enter product name" />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" {...register("slug")} disabled={isReadOnly} placeholder="product-slug" />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                disabled={isReadOnly}
                placeholder="Enter product description"
                rows={4}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={watch("category")}
                  onValueChange={(value) => setValue("category", value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <Select
                  value={watch("sport")}
                  onValueChange={(value) => setValue("sport", value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sport && <p className="text-sm text-red-500">{errors.sport.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value) => setValue("status", value as "active" | "inactive" | "draft")}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Product Variants
              {!isReadOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      variant_code: "",
                      size: "",
                      color: "",
                      price: 0,
                      stock_quantity: 0,
                      sku: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Variant {index + 1}</h4>
                  {!isReadOnly && fields.length > 1 && (
                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Variant Code</Label>
                    <Input {...register(`variants.${index}.variant_code`)} disabled={isReadOnly} placeholder="VAR001" />
                    {errors.variants?.[index]?.variant_code && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.variant_code?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Input {...register(`variants.${index}.size`)} disabled={isReadOnly} placeholder="42" />
                    {errors.variants?.[index]?.size && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.size?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input {...register(`variants.${index}.color`)} disabled={isReadOnly} placeholder="Black" />
                    {errors.variants?.[index]?.color && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.color?.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.price`, { valueAsNumber: true })}
                      disabled={isReadOnly}
                      placeholder="99.99"
                    />
                    {errors.variants?.[index]?.price && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.price?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Stock Quantity</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.stock_quantity`, { valueAsNumber: true })}
                      disabled={isReadOnly}
                      placeholder="100"
                    />
                    {errors.variants?.[index]?.stock_quantity && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.stock_quantity?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input {...register(`variants.${index}.sku`)} disabled={isReadOnly} placeholder="ADI-001-42-BLK" />
                    {errors.variants?.[index]?.sku && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.sku?.message}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploadField
                    label="Main Image"
                    value={watch(`variants.${index}.main_image`)}
                    onChange={(file) => setValue(`variants.${index}.main_image`, file)}
                    disabled={isReadOnly}
                  />

                  <ImageUploadField
                    label="Hover Image"
                    value={watch(`variants.${index}.hover_image`)}
                    onChange={(file) => setValue(`variants.${index}.hover_image`, file)}
                    disabled={isReadOnly}
                  />
                </div>

                <MultiImageUpload
                  label="Additional Images"
                  value={watch(`variants.${index}.additional_images`) || []}
                  onChange={(files) => setValue(`variants.${index}.additional_images`, files)}
                  disabled={isReadOnly}
                  maxFiles={5}
                />
              </div>
            ))}

            {errors.variants && (
              <p className="text-sm text-red-500">{errors.variants.message || "Please check variant information"}</p>
            )}
          </CardContent>
        </Card>

        {!isReadOnly && (
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === "create" ? "Create Product" : "Update Product"}
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
