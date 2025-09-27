"use client"

import { useRouter } from "next/navigation"
import { EnhancedProductForm } from "@/components/products/enhanced-product-form"
import type { ProductFormData } from "@/lib/validations/product"
import { Loading } from "@/components/loading"
import { useProductDetail, useUpdateProduct } from "@/api/hooks/useProducts"
import { useState } from "react"

interface EditProductPageProps {
  params: {
    slug: string
    variant_code: string
    mode: string
  }
}

export default function EditProductPageClient({ params }: EditProductPageProps) {
  const { slug, variant_code, mode: modeParam } = params
  const router = useRouter()
  const mode = (modeParam === "create" || modeParam === "edit") ? modeParam : undefined;

  // useEffect(() => {
  //   if (slug && variantCode) {
  //     fetchProduct()
  //   }
  // }, [slug, variantCode])

  // const fetchProduct = async () => {
  //   try {
  //     const response = await fetch(`/api/admin/products/${slug}/${variantCode}`)
  //     if (!response.ok) throw new Error("Failed to fetch product")

  //     const product = await response.json()
  //     setProductData(product)
  //   } catch (error) {
  //     console.error("Error fetching product:", error)
  //     toast.error("Failed to load product data")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const {
    data: productData,
    isLoading,
    // error,
    // refetch,
  } = useProductDetail(slug, variant_code)

  const variant = productData?.variants?.find((v) => v.variant_code === variant_code)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)
  const displayColor = hoveredColor || variant?.color
  const updateProduct = useUpdateProduct()

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData()

      // Add basic product data
      formData.append("product[name]", data.name)
      formData.append("product[slug]", data.slug)
      formData.append("product[model_number]", data.model_number)
      formData.append("product[description_h5]", data.description_h5 || "")
      formData.append("product[description_p]", data.description_p || "")
      formData.append("product[category]", data.category)
      formData.append("product[sport]", data.sport || "")
      formData.append("product[brand]", data.brand)
      formData.append("product[gender]", data.gender || "Unisex")
      formData.append("product[status]", data.status)
      formData.append("product[product_type]", data.product_type || "")
      formData.append("product[activity]", data.activity || "")
      formData.append("product[material]", data.material || "")
      formData.append("product[collection]", data.collection || "")
      formData.append("product[franchise]", data.franchise || "")
      formData.append("product[care]", data.care || "")
      formData.append("product[specifications]", data.specifications || "")
      formData.append("product[is_featured]", data.is_featured.toString())
      formData.append("product[badge]", data.badge || "")

      data.variants.forEach((variant, index) => {
        if (variant.id) {
          formData.append(`product[variants_attributes][${index}][id]`, variant.id)
        }
        formData.append(`product[variants_attributes][${index}][variant_code]`, variant.variant_code)
        formData.append(`product[variants_attributes][${index}][color]`, variant.color)
        formData.append(`product[variants_attributes][${index}][price]`, variant.price.toString())
        formData.append(
          `product[variants_attributes][${index}][compare_at_price]`,
          (variant.compare_at_price || 0).toString(),
        )
        formData.append(`product[variants_attributes][${index}][stock]`, variant.stock.toString())
        formData.append(`product[variants_attributes][${index}][sku]`, variant.sku)

        // Images
        if (variant.main_image instanceof File) {
          formData.append(`product[variants_attributes][${index}][avatar]`, variant.main_image)
        }
        if (variant.hover_image instanceof File) {
          formData.append(`product[variants_attributes][${index}][hover]`, variant.hover_image)
        }
        if (variant.additional_images) {
          variant.additional_images.forEach((image, imageIndex) => {
            if (image instanceof File) {
              formData.append(`product[variants_attributes][${index}][images][${imageIndex}]`, image)
            }
          })
        }
      })

      const result = await updateProduct.mutateAsync({
        id: id,
        formData,
      })

      if (result?.data?.id) {
        router.push(`/admin/products/${result.data.id}`)
      } else {
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Loading />
        </div>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground">The requested product could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <EnhancedProductForm
          initialData={productData}
          onSubmit={handleSubmit}
          mode={mode}
          loading={updateProduct.isPending}
        />
      </div>
    </div>
  )
}
