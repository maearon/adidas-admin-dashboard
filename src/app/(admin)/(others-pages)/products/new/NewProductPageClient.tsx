"use client"

import { useRouter } from "next/navigation"
import { EnhancedProductForm } from "@/components/products/enhanced-product-form"
import type { ProductFormData } from "@/lib/validations/product"
import { useCreateProduct } from "@/api/hooks/useProducts"
import { toast } from "sonner"

export default function NewProductPageClient() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const createProduct = useCreateProduct()

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)

    try {
      // Create FormData for Rails API
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

      // Add variants data
      data.variants.forEach((variant, index) => {
        formData.append(`product[variants_attributes][${index}][variant_code]`, variant.variant_code)
        formData.append(`product[variants_attributes][${index}][color]`, variant.color)
        formData.append(`product[variants_attributes][${index}][price]`, variant.price.toString())
        formData.append(
          `product[variants_attributes][${index}][compare_at_price]`,
          (variant.compare_at_price || 0).toString(),
        )
        formData.append(`product[variants_attributes][${index}][stock]`, variant.stock.toString())
        formData.append(`product[variants_attributes][${index}][sku]`, variant.sku)

        // Add images
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

      const result = await createProduct.mutateAsync(formData)

      if (result?.data?.id) {
        toast.success("Product created successfully!")
        router.push(`/admin/products/${result.data.id}`)
      } else {
        toast.success("Product created successfully!")
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Failed to create product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Initialize with empty form data for new product
  const initialData: ProductFormData = {
    name: "",
    slug: "",
    model_number: "",
    description_h5: "",
    description_p: "",
    brand: "Adidas",
    category: "",
    sport: "",
    gender: "Unisex",
    status: "active",
    product_type: "",
    activity: "",
    material: "",
    collection: "",
    franchise: "",
    care: "",
    specifications: "",
    is_featured: false,
    badge: "",
    variants: [
      {
        variant_code: "",
        color: "",
        price: 0,
        compare_at_price: 0,
        stock: 0,
        sku: "",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <EnhancedProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          mode="create"
          loading={createProduct.isPending}
        />
      </div>
    </div>
  )
}
