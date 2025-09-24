import { z } from "zod"

export const productVariantSchema = z.object({
  id: z.string().optional(),
  variant_code: z.string().min(1, "Variant code is required"),
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  price: z.number().min(0, "Price must be positive"),
  stock_quantity: z.number().min(0, "Stock quantity must be positive"),
  sku: z.string().min(1, "SKU is required"),
  main_image: z.any().optional(),
  hover_image: z.any().optional(),
  additional_images: z.array(z.any()).optional(),
  existing_main_image: z.string().optional(),
  existing_hover_image: z.string().optional(),
  existing_additional_images: z.array(z.string()).optional(),
  remove_images: z.array(z.string()).optional(),
})

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  sport: z.string().min(1, "Sport is required"),
  brand: z.string().min(1, "Brand is required"),
  status: z.enum(["active", "inactive", "draft"]),
  variants: z.array(productVariantSchema).min(1, "At least one variant is required"),
})

export type ProductFormData = z.infer<typeof productSchema>
export type ProductVariantFormData = z.infer<typeof productVariantSchema>
