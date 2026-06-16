import type { TranslationData } from "@/components/products/ProductTranslationsEditor"

function hasTranslationContent(data?: TranslationData): boolean {
  if (!data) return false

  if (data.description?.descTitle?.trim() || data.description?.descText?.trim()) return true
  if (data.details?.some((d) => d.trim() !== "")) return true
  if (data.highlights?.some((h) => h.title.trim() || h.text.trim())) return true
  if (data.sectionOrder?.length) return true

  return false
}

export function appendTranslationsToFormData(
  formData: FormData,
  translations: Record<string, TranslationData>
) {
  Object.entries(translations).forEach(([locale, data]) => {
    if (!hasTranslationContent(data)) return

    formData.append(
      `product[translations_attributes][${locale}]`,
      JSON.stringify({
        ...data,
        details: data.details?.filter((d) => d.trim() !== "") ?? [],
        highlights:
          data.highlights?.filter((h) => h.title.trim() || h.text.trim()) ?? [],
      })
    )
  })
}
