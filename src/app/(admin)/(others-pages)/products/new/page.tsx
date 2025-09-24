import { Suspense } from "react";
import { Metadata } from "next";
import NewProductPageClient from "./NewProductPageClient";
import { formatSlugTitle } from "@/utils/category-config.auto";
import Loading from "@/components/loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

// ✅ generateMetadata must be async with awaited `params`
export async function generateMetadata(
  props: { params: { slug?: string } }
): Promise<Metadata> {
  const { slug } = await Promise.resolve(props.params || {});
  const pageTitle = formatSlugTitle(slug || "New Product");
  return {
    title: pageTitle,
  };
}

// ✅ Main page function must await `params`
const ProductDetailPage = async () => {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
      <PageBreadcrumb pageTitle="New Product" />
        <ComponentCard title="All Products">
        <NewProductPageClient />
        </ComponentCard>
      </Suspense>
    </div>
  );
};

export default ProductDetailPage;
