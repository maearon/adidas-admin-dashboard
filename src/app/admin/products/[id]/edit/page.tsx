"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"
import { railsApi } from "@/lib/api/rails-client"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await railsApi.getProduct(params.id)
        setProduct(productData)
      } catch (error) {
        console.error("Failed to load product:", error)
      } finally {
        setInitialLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true)
      await railsApi.updateProduct(params.id, formData)
      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to update product:", error)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
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

      <ProductForm product={product} onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
