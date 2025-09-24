"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { EnhancedProductForm } from "@/components/products/enhanced-product-form"
import type { ProductFormData } from "@/lib/validations/product"
import { AdminHeader } from "@/components/admin-header"
import { Loading } from "@/components/loading"
import { toast } from "sonner"
import { useProductDetail } from "@/hooks/useProducts"

interface ProductDetailPageProps {
  params: { 
    slug: string; 
    variant_code: string 
  };
}

export default function EditProductPageClient({ params }: ProductDetailPageProps) {
  const { slug, variant_code } = params
  const router = useRouter()
  const searchParams = useSearchParams()
  // const [productData, setProductData] = useState<ProductFormData | null>(null)
  // const [loading, setLoading] = useState(true)

  // const slug = searchParams.get("slug")
  // const variantCode = searchParams.get("variant_code")
  const modeParam = searchParams.get("mode");
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

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData()

      formData.append("product[name]", data.name)
      formData.append("product[slug]", data.slug)
      formData.append("product[description]", data.description)
      formData.append("product[category]", data.category)
      formData.append("product[sport]", data.sport)
      formData.append("product[brand]", data.brand)
      formData.append("product[status]", data.status)

      data.variants.forEach((variant, index) => {
        formData.append(`product[variants_attributes][${index}][id]`, variant.id || "")
        formData.append(`product[variants_attributes][${index}][variant_code]`, variant.variant_code)
        formData.append(`product[variants_attributes][${index}][size]`, variant.size)
        formData.append(`product[variants_attributes][${index}][color]`, variant.color)
        formData.append(`product[variants_attributes][${index}][price]`, variant.price.toString())
        formData.append(`product[variants_attributes][${index}][stock_quantity]`, variant.stock_quantity.toString())
        formData.append(`product[variants_attributes][${index}][sku]`, variant.sku)

        if (variant.main_image instanceof File) {
          formData.append(`product[variants_attributes][${index}][main_image]`, variant.main_image)
        } else if (variant.existing_main_image) {
          formData.append(`product[variants_attributes][${index}][existing_main_image]`, variant.existing_main_image)
        }

        if (variant.hover_image instanceof File) {
          formData.append(`product[variants_attributes][${index}][hover_image]`, variant.hover_image)
        } else if (variant.existing_hover_image) {
          formData.append(`product[variants_attributes][${index}][existing_hover_image]`, variant.existing_hover_image)
        }

        if (variant.additional_images) {
          variant.additional_images.forEach((image, imageIndex) => {
            if (image instanceof File) {
              formData.append(`product[variants_attributes][${index}][additional_images][${imageIndex}]`, image)
            } else if (typeof image === "string") {
              formData.append(
                `product[variants_attributes][${index}][existing_additional_images][${imageIndex}]`,
                image,
              )
            }
          })
        }

        if (variant.remove_images) {
          variant.remove_images.forEach((imageId, removeIndex) => {
            formData.append(`product[variants_attributes][${index}][remove_images][${removeIndex}]`, imageId)
          })
        }
      })

      const response = await fetch(`/api/admin/products/${slug}/${variant_code}`, {
        method: "PATCH",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update product")
      }

      toast.success("Product updated successfully!")
      router.push(`/admin/products/${data.id}`)
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product. Please try again.")
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
        <EnhancedProductForm initialData={productData} onSubmit={handleSubmit} mode={mode} />
      </div>
    </div>
  )
}
