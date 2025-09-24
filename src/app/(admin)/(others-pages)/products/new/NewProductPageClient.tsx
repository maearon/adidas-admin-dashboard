"use client"

import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"
import { railsApi } from "@/lib/api/rails-client"

export default function NewProductPageClient() {
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    try {
      await railsApi.createProduct(formData)
      router.push("/products")
    } catch (error) {
      console.error("Failed to create product:", error)
    } finally {
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-gray-700 dark:text-gray-400">
        <h1 className="text-3xl font-bold tracking-tight uppercase">Create New Product</h1>
        <p>Add a new product to your store catalog.</p>
      </div>

      <ProductForm
        product={null}
        onSubmit={handleSubmit}
        loading={false}
        mode="create"
      />
    </div>
  )
}
