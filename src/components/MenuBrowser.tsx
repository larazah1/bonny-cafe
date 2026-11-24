"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { useBranch } from "@/context/BranchContext";
import { useAdminData } from "@/context/AdminDataContext";
import { CATEGORIES } from "@/lib/menu";
import { ProductCategory, ResolvedProduct } from "@/lib/types";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";

export function MenuBrowser({ compact = false }: { compact?: boolean }) {
  const { dict } = useLocale();
  const { branchId } = useBranch();
  const { productsForBranch } = useAdminData();
  const [category, setCategory] = useState<ProductCategory>(CATEGORIES[0].id);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ResolvedProduct | null>(null);

  const products = useMemo(() => {
    const list = productsForBranch(branchId).filter((p) => p.category === category);
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q) || p.nameAr.includes(query.trim()));
  }, [productsForBranch, branchId, category, query]);

  return (
    <div>
      <div className={`flex flex-col gap-3 ${compact ? "" : "sm:flex-row sm:items-center"}`}>
        <CategoryTabs active={category} onChange={setCategory} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.menu.search}
          className="focus-ring w-full rounded-full border border-line bg-white px-5 py-2.5 text-sm placeholder:text-brown-300 sm:max-w-xs"
        />
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-subtle">{dict.menu.noResults}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} onSelect={setSelected} />
          ))}
        </div>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
