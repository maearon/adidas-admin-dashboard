"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EnhancedProductForm } from "@/components/products/enhanced-product-form"
import type { ProductFormData } from "@/lib/validations/product"
import { AdminHeader } from "@/components/admin-header"
import { toast } from "sonner"

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)

    try {
      // Create FormData for Rails API
      const formData = new FormData()

      // Add basic product data
      formData.append("product[name]", data.name)
      formData.append("product[slug]", data.slug)
      formData.append("product[description]", data.description)
      formData.append("product[category]", data.category)
      formData.append("product[sport]", data.sport)
      formData.append("product[brand]", data.brand)
      formData.append("product[status]", data.status)

      // Add variants data
      data.variants.forEach((variant, index) => {
        formData.append(`product[variants_attributes][${index}][variant_code]`, variant.variant_code)
        formData.append(`product[variants_attributes][${index}][size]`, variant.size)
        formData.append(`product[variants_attributes][${index}][color]`, variant.color)
        formData.append(`product[variants_attributes][${index}][price]`, variant.price.toString())
        formData.append(`product[variants_attributes][${index}][stock_quantity]`, variant.stock_quantity.toString())
        formData.append(`product[variants_attributes][${index}][sku]`, variant.sku)

        // Add images
        if (variant.main_image instanceof File) {
          formData.append(`product[variants_attributes][${index}][main_image]`, variant.main_image)
        }
        if (variant.hover_image instanceof File) {
          formData.append(`product[variants_attributes][${index}][hover_image]`, variant.hover_image)
        }
        if (variant.additional_images) {
          variant.additional_images.forEach((image, imageIndex) => {
            if (image instanceof File) {
              formData.append(`product[variants_attributes][${index}][additional_images][${imageIndex}]`, image)
            }
          })
        }
      })

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      const result = await response.json()
      toast.success("Product created successfully!")
      router.push(`/admin/products/${result.id}`)
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Failed to create product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-6">
        <EnhancedProductForm onSubmit={handleSubmit} mode="create" />
      </div>
    </div>
  )
}
