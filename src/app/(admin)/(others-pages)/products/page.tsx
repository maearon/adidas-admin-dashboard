"use client"

import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Package, Plus, Filter, Grid, List, Search } from "lucide-react"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedSearchField } from "@/components/search/enhanced-search-field"
import Image from "next/image"
import ComponentCard from "@/components/common/ComponentCard"
import { useSearchProductsFeed } from "@/hooks/useProducts"

interface Product {
  id: number | string
  name: string
  title?: string
  price: number
  original_price?: number
  sport?: string
  brand?: string
  category?: string
  image?: string
  image_url?: string
  thumbnail?: string
  variants?: any[]
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const query = searchParams.get("q") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")

  const { data, isFetching } = useSearchProductsFeed(query, page)

  const products: Product[] = data?.pages.flatMap((p) => p.products) || []
  const pagination = data?.pages?.[0]?.pagination ?? {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12,
  }

  const handleSearch = (searchQuery: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) params.set("q", searchQuery)
    else params.delete("q")
    params.set("page", "1")
    router.push(`/products?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <PageBreadcrumb pageTitle="Products" />
      <ComponentCard title="All Products">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center bg-black dark:bg-white text-white dark:text-black">
                <Package className="size-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-wide text-black dark:text-white">
                  PRODUCTS
                </h1>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  {pagination.totalProducts} products found
                  {query && ` for "${query}"`}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 sm:w-80">
                <EnhancedSearchField
                  placeholder="Search products..."
                  onSearch={handleSearch}
                  autoFocus={!!query}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <AdidasButton
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="border"
                >
                  <Grid className="h-4 w-4" />
                </AdidasButton>

                <AdidasButton
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="border"
                >
                  <List className="h-4 w-4" />
                </AdidasButton>

                <AdidasButton className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] text-gray-700 dark:text-gray-400">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">FILTERS</span>
                </AdidasButton>

                <AdidasButton
                  href="/products/new"
                  className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] text-gray-700 dark:text-gray-400"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">ADD PRODUCT</span>
                </AdidasButton>
              </div>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isFetching && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted animate-pulse mb-4" />
                    <div className="h-4 bg-muted animate-pulse mb-2" />
                    <div className="h-4 bg-muted animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Products */}
          {!isFetching && products.length > 0 && (
            <>
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-lg transition-shadow"
                  >
                    <CardContent
                      className={`p-4 ${viewMode === "list" ? "flex gap-4" : ""}`}
                    >
                      {/* Image */}
                      <div
                        className={`${
                          viewMode === "list"
                            ? "w-32 h-32 flex-shrink-0"
                            : "aspect-square"
                        } bg-muted mb-4 relative overflow-hidden`}
                      >
                        {(product.image ||
                          product.image_url ||
                          product.thumbnail) && (
                          <Image
                            src={
                              product.image ||
                              product.image_url ||
                              product.thumbnail ||
                              ""
                            }
                            alt={product.name || product.title || ""}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-sm line-clamp-2 text-gray-700 dark:text-gray-400">
                              {product.name || product.title}
                            </h3>
                            {product.sport && (
                              <Badge
                                variant="secondary"
                                className="text-xs mt-1 text-gray-700 dark:text-gray-400"
                              >
                                {product.sport}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700 dark:text-gray-400">
                              ${product.price}
                            </span>
                            {product.original_price &&
                              product.original_price > product.price && (
                                <span className="text-sm text-gray-700 dark:text-gray-400 line-through">
                                  ${product.original_price}
                                </span>
                              )}
                          </div>

                          <div className="flex gap-1">
                            <AdidasButton size="sm" variant="outline" className="text-xs text-gray-700 dark:text-gray-400">
                              EDIT
                            </AdidasButton>
                            <AdidasButton size="sm" className="text-xs text-gray-700 dark:text-gray-400">
                              VIEW
                            </AdidasButton>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <AdidasButton
                    variant="outline"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className="border text-gray-700 dark:text-gray-400"
                  >
                    PREVIOUS
                  </AdidasButton>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <AdidasButton
                          key={pageNum}
                          variant={pageNum === pagination.currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="border w-10 text-gray-700 dark:text-gray-400"
                        >
                          {pageNum}
                        </AdidasButton>
                      )
                    })}
                  </div>

                  <AdidasButton
                    variant="outline"
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className="border text-gray-700 dark:text-gray-400"
                  >
                    NEXT
                  </AdidasButton>
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {!isFetching && products.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-700 dark:text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-400">
                No products found
              </h3>
              <p className="text-gray-700 dark:text-gray-400 mb-4">
                {query ? `No results for "${query}"` : "No products available"}
              </p>
              {query && (
                <AdidasButton
                  onClick={() => handleSearch("")}
                  variant="outline"
                  className="border text-gray-700 dark:text-gray-400"
                >
                  CLEAR SEARCH
                </AdidasButton>
              )}
            </div>
          )}
        </div>
      </ComponentCard>
    </div>
  )
}
