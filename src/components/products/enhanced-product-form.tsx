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
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface EnhancedProductFormProps {
  initialData?: ProductFormData
  onSubmit: (data: ProductFormData) => Promise<void>
  mode?: Mode
  loading?: boolean
}

export function EnhancedProductForm({
  initialData,
  onSubmit,
  mode: initialMode = "create",
  loading = false,
}: EnhancedProductFormProps) {
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
      // slug: "",
      model_number: "",
      description: "",
      description_h5: "",
      description_p: "",
      category: "",
      sport: "",
      brand: "Adidas",
      gender: "Unisex",
      // status: "active",
      product_type: "",
      activity: "",
      // material: "",
      // collection: "",
      franchise: "",
      care: "",
      specifications: "",
      // is_featured: false,
      badge: "",
      variants: [
        {
          variant_code: "",
          color: "",
          price: 0,
          compare_at_price: 0,
          stock: 0,
          // sku: "",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  })

  const watchName = watch("name")

  // Auto-generate slug and model_number from name
  useEffect(() => {
    if (watchName && mode === "create") {
      // const slug = watchName
      //   .toLowerCase()
      //   .replace(/[^a-z0-9]+/g, "-")
      //   .replace(/(^-|-$)/g, "")
      // setValue("slug", slug)

      // const modelNumber =
      //   watchName
      //     .toUpperCase()
      //     .replace(/[^A-Z0-9]+/g, "")
      //     .substring(0, 10) + Date.now().toString().slice(-3)
      // setValue("model_number", modelNumber)
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

      <form id="product-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" {...register("name")} disabled={isReadOnly} placeholder="Enter product name" />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model_number">Model Number *</Label>
                <Input id="model_number" {...register("model_number")} disabled={isReadOnly} placeholder="MODEL123" />
                {errors.model_number && <p className="text-sm text-red-500">{errors.model_number.message}</p>}
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} disabled={isReadOnly} placeholder="product-slug" />
              {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="description_h5">Short Description</Label>
              <Textarea
                id="description_h5"
                {...register("description_h5")}
                disabled={isReadOnly}
                placeholder="Brief product description"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_p">Full Description</Label>
              <Textarea
                id="description_p"
                {...register("description_p")}
                disabled={isReadOnly}
                placeholder="Detailed product description"
                rows={4}
              />
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select
                  value={watch("brand")}
                  onValueChange={(value) => setValue("brand", value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adidas">Adidas</SelectItem>
                    <SelectItem value="Nike">Nike</SelectItem>
                    <SelectItem value="Puma">Puma</SelectItem>
                    <SelectItem value="Reebok">Reebok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                    <SelectItem value="Shoes">Shoes</SelectItem>
                    <SelectItem value="Apparel">Apparel</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="Running">Running</SelectItem>
                    <SelectItem value="Soccer">Soccer</SelectItem>
                    <SelectItem value="Basketball">Basketball</SelectItem>
                    <SelectItem value="Tennis">Tennis</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={watch("gender")}
                  onValueChange={(value) => setValue("gender", value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Men">Men</SelectItem>
                    <SelectItem value="Women">Women</SelectItem>
                    <SelectItem value="Unisex">Unisex</SelectItem>
                    <SelectItem value="Kids">Kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_type">Product Type</Label>
                <Select
                  value={watch("product_type")}
                  onValueChange={(value) => setValue("product_type", value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sneakers">Shoes</SelectItem>
                    <SelectItem value="Sneakers">Sneakers</SelectItem>
                    <SelectItem value="Cleats">Cleats</SelectItem>
                    <SelectItem value="Sandals">Sandals</SelectItem>
                    <SelectItem value="Hoodie">Hoodie</SelectItem>
                    <SelectItem value="Pants">Pants</SelectItem>
                    <SelectItem value="Shorts">Shorts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Franchise</Label>
                <Select
                  value={watch("franchise")}
                  onValueChange={(value) => setValue("franchise", value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select franchise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Tubular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value) => setValue("status", value as "active" | "inactive")}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  {...register("material")}
                  disabled={isReadOnly}
                  placeholder="e.g., Leather, Mesh, Cotton"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection">Collection</Label>
                <Input
                  id="collection"
                  {...register("collection")}
                  disabled={isReadOnly}
                  placeholder="e.g., Ultraboost, Gazelle"
                />
              </div>
            </div> */}

            {/* <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={watch("is_featured")}
                onCheckedChange={(checked) => setValue("is_featured", checked)}
                disabled={isReadOnly}
              />
              <Label htmlFor="is_featured">Featured Product</Label>
            </div> */}

            {/* Additional Information */}
            <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="care">Care Instructions</Label>
              <Textarea
                id="care"
                {...register("care")}
                disabled={isReadOnly}
                placeholder="Care instructions for the product"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specifications">Specifications</Label>
              <Textarea
                id="specifications"
                {...register("specifications")}
                disabled={isReadOnly}
                placeholder="Technical specifications"
                rows={3}
              />
            </div>
            </div>
            
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploadField
                label="Main Image"
                value={watch("main_image")}
                onChange={(file) => setValue("main_image", file)}
                disabled={isReadOnly}
              />

              <ImageUploadField
                label="Hover Image"
                value={watch("hover_image")}
                onChange={(file) => setValue("hover_image", file)}
                disabled={isReadOnly}
              />
            </div>
            {(Object.keys(errors).length > 0) && (
              <p className="text-sm text-red-500">Please check product information</p>
            )}
          </CardContent>
        </Card>

        {/* Product Variants */}
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
                      color: "",
                      price: 0,
                      compare_at_price: 0,
                      stock: 0,
                      // sku: "",
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
              <div key={field.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    Variant {index + 1}
                    {watch(`variants.${index}.color`) && (
                      <Badge variant="secondary">{watch(`variants.${index}.color`)}</Badge>
                    )}
                  </h4>
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

                  {/* <div className="space-y-2">
                    <Label>Size</Label>
                    <Input {...register(`variants.${index}.size`)} disabled={isReadOnly} placeholder="42" />
                    {errors.variants?.[index]?.size && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.size?.message}</p>
                    )}
                  </div> */}

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input {...register(`variants.${index}.color`)} disabled={isReadOnly} placeholder="Black" />
                    {errors.variants?.[index]?.color && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.color?.message}</p>
                    )}
                  </div>

                  {/* <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input {...register(`variants.${index}.sku`)} disabled={isReadOnly} placeholder="ADI-001-42-BLK" />
                  </div> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
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
                    <Label>Compare Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.compare_at_price`, { valueAsNumber: true })}
                      disabled={isReadOnly}
                      placeholder="129.99"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Stock Quantity</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                      disabled={isReadOnly}
                      placeholder="100"
                    />
                    {errors.variants?.[index]?.stock && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.stock?.message}</p>
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
          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting || loading} className="min-w-[120px]">
              {(isSubmitting || loading) ? (
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
