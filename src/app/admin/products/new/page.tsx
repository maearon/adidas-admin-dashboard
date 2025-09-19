"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"
import { railsApi } from "@/lib/api/rails-client"

export default function NewProductPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true)
      await railsApi.createProduct(formData)
      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to create product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">Create New Product</h1>
        <p className="text-muted-foreground">Add a new product to your store catalog.</p>
      </div>

      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
