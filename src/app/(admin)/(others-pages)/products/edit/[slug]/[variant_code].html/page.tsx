"use client"

import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"
import { railsApi } from "@/lib/api/rails-client"
import { useProductDetail } from "@/hooks/useProducts"

interface ProductDetailPageProps {
  params: { 
    slug: string; 
    variant_code: string 
  };
}

export default function EditProductPage({ params }: ProductDetailPageProps) {
  const { slug, variant_code } = params
  console.log("EditProductPage params:", params)
  const router = useRouter()

  const {
    data: product,
    isLoading,
    // error,
    // refetch,
  } = useProductDetail(slug, variant_code)

  const handleSubmit = async (formData: FormData) => {
    try {
      await railsApi.updateProduct(variant_code, formData)
      router.push("/products")
    } catch (error) {
      console.error("Failed to update product:", error)
    } finally {
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">Edit Product</h1>
        <p className="text-muted-foreground">Update product information and settings.</p>
      </div>

      <ProductForm product={product} onSubmit={handleSubmit} loading={isLoading} />
    </div>
  )
}
