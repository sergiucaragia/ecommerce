"use client";

import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { fetchProducts, fetchCategories } from "@/lib/queries/products";
import { useT } from "@/lib/i18n/useT";
import { ProductCard } from "./ProductCard";
import type { Category } from "@/types";

export function CatalogClient() {
  const { t } = useT();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [gender, setGender] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout((window as any).__searchTimer);
    (window as any).__searchTimer = setTimeout(
      () => setDebouncedSearch(value),
      400,
    );
  };

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["products", debouncedSearch, categoryId, gender],
      queryFn: ({ pageParam = 1 }) =>
        fetchProducts({
          search: debouncedSearch,
          categoryId,
          gender,
          page: pageParam as number,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const loaded = allPages.reduce((s, p) => s + p.products.length, 0);
        return loaded < lastPage.total ? allPages.length + 1 : undefined;
      },
    });

  const products = data?.pages.flatMap((p) => p.products) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const hasActiveFilters = !!(categoryId || gender);
  const clearFilters = () => {
    setCategoryId("");
    setGender("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      {/* Header sezione */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-1"
            style={{ color: "var(--gold)" }}
          >
            Catalog
          </p>
          <h2
            className="font-display text-4xl font-bold tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            {!isLoading &&
              `${total} ${total === 1 ? t.productFound : t.productsFound}`}
          </h2>
        </div>

        {/* Ricerca */}
        <div className="relative sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: "var(--muted)" }}
          />
          <input
            type="search"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none transition-shadow"
            style={{
              border: "1px solid var(--border)",
              color: "var(--ink)",
            }}
          />
        </div>
      </div>

      {/* Filtri orizzontali pill */}
      <div
        className="flex flex-wrap items-center gap-2 pb-6 mb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {/* Tutte le categorie */}
        <button
          onClick={() => setCategoryId("")}
          className="px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all"
          style={
            categoryId === ""
              ? { background: "var(--ink)", color: "var(--cream)" }
              : {
                  border: "1px solid var(--border)",
                  color: "var(--muted)",
                  background: "transparent",
                }
          }
        >
          {t.allCategories}
        </button>

        {categories?.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryId(c.id)}
            className="px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all"
            style={
              categoryId === c.id
                ? { background: "var(--ink)", color: "var(--cream)" }
                : {
                    border: "1px solid var(--border)",
                    color: "var(--muted)",
                    background: "transparent",
                  }
            }
          >
            {c.name}
          </button>
        ))}

        {/* Separatore */}
        <div
          className="w-px h-5 mx-1"
          style={{ background: "var(--border)" }}
        />

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-xs transition-opacity hover:opacity-60"
            style={{ color: "var(--muted)" }}
          >
            <X className="w-3 h-3" />
            {t.removeFilters}
          </button>
        )}
      </div>

      {/* Griglia prodotti */}
      {isLoading ? (
        <div className="product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse aspect-[3/4]"
              style={{ background: "#EDE8E1" }}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-28 text-center">
          <p
            className="font-display text-3xl font-bold tracking-tight"
            style={{ color: "#C8BFB4" }}
          >
            {t.noProductsFound}
          </p>
        </div>
      ) : (
        <>
          <div className="product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasNextPage && (
            <div className="text-center mt-16">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="inline-flex items-center gap-4 group disabled:opacity-40"
              >
                <span
                  className="w-16 h-px transition-all duration-300 group-hover:w-8"
                  style={{ background: "var(--border)" }}
                />
                <span
                  className="text-xs font-semibold tracking-[0.25em] uppercase"
                  style={{ color: "var(--muted)" }}
                >
                  {isFetchingNextPage ? t.loading : t.loadMore}
                </span>
                <span
                  className="w-16 h-px transition-all duration-300 group-hover:w-8"
                  style={{ background: "var(--border)" }}
                />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
