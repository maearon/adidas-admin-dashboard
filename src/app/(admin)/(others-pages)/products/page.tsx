"use client"

import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Package, Plus, Filter, Grid, List, Search, Eye, Edit } from "lucide-react"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedSearchField } from "@/components/search/enhanced-search-field"
import Image from "next/image"
import ComponentCard from "@/components/common/ComponentCard"
import { useSearchProductsFeed } from "@/hooks/useProducts"
import Link from "next/link"
import { slugify } from "@/utils/slugify"
import { Mode } from "@/components/ui/mode-switcher"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import ProductListContainer from "@/components/ProductListContainer"
import { useTranslations } from "@/hooks/useTranslations"

interface Variant {
  variant_code: string
  avatar_url: string
  hover_url?: string
}

interface Product {
  id: number | string
  name: string
  title?: string
  slug?: string | null
  price: number
  original_price?: number
  sport?: string
  brand?: string
  category?: string
  main_image_url?: string
  hover_image_url?: string
  thumbnail?: string
  variants?: Variant[]
}

export default function ProductsPage() {
  const t = useTranslations("common")
  const t2 = useTranslations("productList")
  const searchParams = useSearchParams()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const query = searchParams.get("q") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")

  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage, 
    status,
    refetch,
  } = useSearchProductsFeed(query || 'a')

  const products: Product[] = data?.pages.flatMap((p) => p.products) || []
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;
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

  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <PageBreadcrumb pageTitle="Products" />
      <ComponentCard title="All Products"> */}
      <div className="container mx-auto px-4 py-6 text-gray-700 dark:text-gray-400">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-10 items-center justify-center text-black dark:text-white">
              <Package className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide text-black dark:text-white">
                PRODUCTS
              </h1>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                {totalCount} products found
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
              {/* Grid view */}
              <AdidasButton
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] text-gray-700 dark:text-gray-400",
                  viewMode === "grid" &&
                    "border-brand-500 ring-2 ring-brand-500/20 text-brand-600 dark:text-brand-400"
                )}
              >
                <Grid className="h-4 w-4" />
              </AdidasButton>

              {/* List view */}
              <AdidasButton
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={cn(
                  "border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] text-gray-700 dark:text-gray-400",
                  viewMode === "list" &&
                    "border-brand-500 ring-2 ring-brand-500/20 text-brand-600 dark:text-brand-400"
                )}
              >
                <List className="h-4 w-4" />
              </AdidasButton>

              {/* Filters */}
              <AdidasButton
                variant="outline"
                shadow={false}
                pressEffect={false}
                showArrow={false}
                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] text-gray-700 dark:text-gray-400"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">FILTERS</span>
              </AdidasButton>

              {/* Add product */}
              <AdidasButton
                variant="outline"
                shadow={false}
                pressEffect={false}
                showArrow={false}
                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] text-gray-700 dark:text-gray-400"
              >
                <Link href="/products/new" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">ADD PRODUCT</span>
                </Link>
              </AdidasButton>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {(status === "pending") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted animate-pulse mb-4" />
                  <div className="h-4 bg-muted animate-pulse mb-2" />
                  <div className="h-4 bg-muted animate-pulse w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <InfiniteScrollContainer onBottomReached={handleLoadMore}>
          <ProductListContainer
            products={products}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            viewMode={viewMode}
          />
        </InfiniteScrollContainer>

        {/* No Results */}
        {!isFetching && products.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-700 dark:text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-400">
              {t?.noProductsFound || "No products found"}
            </h3>
            <p className="text-gray-700 dark:text-gray-400 mb-4">
              {query
                ? `No results for "${query}"`
                : "No products available"}
            </p>
            {query && (
              <Button
                onClick={() => handleSearch("")}
                variant="outline"
                className="border text-gray-700 dark:text-gray-400"
              >
                CLEAR SEARCH
              </Button>
            )}
            <Button onClick={() => refetch()} variant="default">
              {t2?.retry || "Retry"}
            </Button>
            <Button variant="link" onClick={() => router.back()} className="mt-2 text-base text-gray-500">
              {t2?.goBack || "← Go Back"}
            </Button>
          </div>
        )}
      </div>
      {/* </ComponentCard> */}
    </div>
  )
}
