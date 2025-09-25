"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import WishButton from "./wish-button";
import ProductVariantCarousel from "./ProductVariantCarousel";
import { mapProductToWishlistItem } from "@/lib/mappers/product-to-wishlist";
import { slugify } from "@/utils/slugify";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import ProductPrice from "./ProductCardPrice";
import { useTranslations } from "@/hooks/useTranslations";
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation"
import { Mode } from "@/components/ui/mode-switcher";

interface ProductCardProps {
  slug?: string;
  product: Product;
  viewMode: "grid" | "list";
  showAddToBag?: boolean;
  minimalMobile?: boolean;
}

export default function ProductCard({
  product,
  viewMode,
  showAddToBag = false,
  minimalMobile = false,
}: ProductCardProps) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false);
  const [variantHeight, setVariantHeight] = useState(0);
  const variantRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // đo chiều cao panel variant
  useEffect(() => {
    if (variantRef.current) {
      setVariantHeight(variantRef.current.offsetHeight);
    }
  }, [product?.variants?.length, isMobile]);

  const dispatch = useAppDispatch();
  const defaultVariant = product.variants?.[0] ?? null;
  const fallbackUrl = `/products/edit/${slugify(product.name || "product")}/${defaultVariant?.variant_code}.html?mode=view`;

  const [currentVariant, setCurrentVariant] = useState(defaultVariant);
  const [currentUrl, setCurrentUrl] = useState(fallbackUrl);
  const isPlaceholder = product.__isPlaceholder || !product.name;

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        id: Number(product.id),
        name: product.name || "Unknown Product",
        price: product.price ?? 0, // ✅ raw number, không format
        compareAtPrice: product.compare_at_price ?? null, // nếu cần
        image: currentVariant?.avatar_url || "/placeholder.png",
        color: currentVariant?.color || "Default",
        size: currentVariant?.sizes[0] || "M",
      })
    );
  };

  const hasHoverImage = !!product.hover_image_url?.trim();
  const hasVariants = (product.variants?.length ?? 0) > 1;
  const hasVariantPanel = hasVariants && variantHeight > 0;

  if (isPlaceholder) {
    return (
      <div className="border border-gray-200 rounded shadow-xs p-2 animate-pulse min-h-[300px]">
        <div className="relative aspect-square bg-gray-200 rounded mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
        {showAddToBag && <div className="h-10 bg-gray-300 rounded w-full" />}
      </div>
    );
  }

  const productImage =
    currentVariant?.avatar_url ||
    currentVariant?.image_urls?.[0] ||
    product.main_image_url ||
    "/placeholder.png";

  const hoverImage =
    currentVariant?.hover_url ||
    currentVariant?.image_urls?.[2] ||
    product.hover_image_url ||
    "/placeholder.png";

  const shouldHideDetails = minimalMobile && isMobile

  return (
    <Link
      href={currentUrl}
      onMouseLeave={() => {
        setCurrentVariant(defaultVariant);
        setCurrentUrl(fallbackUrl);
      }}
    >
      <Card
        key={product.id}
        className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-lg transition-shadow"
      >
        <CardContent
          className={`p-4 ${
            viewMode === "list" ? "flex gap-4" : ""
          }`}
        >
          {/* Image */}
          <div
            className={`${
              viewMode === "list"
                ? "w-32 h-32 flex-shrink-0"
                : "aspect-square"
            } mb-4 relative overflow-hidden`}
          >
            {productImage && (
              <>
                <Image
                  src={productImage}
                  alt={product.name || product.title || ""}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                {hoverImage && (
                  <Image
                    src={hoverImage}
                    alt={`${product.name} hover`}
                    fill
                    className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                )}
              </>
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
                {product.compare_at_price &&
                  product.compare_at_price > product.price && (
                    <span className="text-sm text-gray-700 dark:text-gray-400 line-through">
                      ${product.compare_at_price}
                    </span>
                  )}
              </div>

              <div className="flex gap-1">
                <ToggleGroup
                  type="single"
                  onValueChange={(value) => {
                    if (value) {
                      router.push(
                        `/products/edit/${slugify(product.name)}/${defaultVariant?.variant_code}.html?mode=${value as Mode}`
                      )
                    }
                  }}
                >
                  <ToggleGroupItem value="view" aria-label="View mode">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </ToggleGroupItem>
                  <ToggleGroupItem value="edit" aria-label="Edit mode">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
