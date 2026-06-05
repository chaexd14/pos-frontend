"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useMemo, useState, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Plus, Trash2, Archive, Check } from "lucide-react";
import { Category, InventoryProduct, POSProduct, Recipe, RecipeIngredient } from "../items/types";
import { ManageRecipeDialog } from "../items/components/ManageRecipeDialog";

// ─── Seed Data ────────────────────────────────────────────────
const seedInventory: InventoryProduct[] = [
  { id: 1, name: "Coffee Beans", description: "Arabica beans",  unit: "grams" },
  { id: 2, name: "Milk",         description: "Fresh milk",     unit: "ml" },
  { id: 3, name: "Sugar",        description: "White sugar",    unit: "grams" },
  { id: 4, name: "Ice",          description: "Ice cubes",      unit: "grams" },
  { id: 5, name: "Sugar Syrup",  description: "Sweetener base", unit: "ml" },
];
const seedCategories: Category[] = [
  { id: 1, name: "Beverages", description: "Drinks and refreshments" },
  { id: 2, name: "Pastries",  description: "Cakes and croissants" },
];
const seedProducts: POSProduct[] = [
  { id: 1, name: "Iced Coffee", description: "Cold brewed coffee",   price: 120, categoryId: 1, sourceType: "composed", active: true },
  { id: 2, name: "Latte",       description: "Milk espresso blend",  price: 130, categoryId: 1, sourceType: "composed", active: true },
  { id: 3, name: "Croissant",   description: "Buttery pastry",       price: 90,  categoryId: 2, sourceType: "direct",   active: true },
];
const seedRecipes: Recipe[] = [
  {
    id: 1, posProductId: 1, name: "Standard Iced Coffee",
    ingredients: [
      { inventoryProductId: 1, quantity: 20,  unit: "grams" },
      { inventoryProductId: 2, quantity: 150, unit: "ml" },
      { inventoryProductId: 3, quantity: 10,  unit: "grams" },
      { inventoryProductId: 4, quantity: 200, unit: "grams" },
    ],
  },
];

const PAGE_SIZE = 10;

const TABS = [
  { key: "manage",  label: "Products" },
  { key: "add",     label: "Add New" },
  { key: "recipes", label: "Recipes" },
];

const SOURCE_STYLES: Record<string, string> = {
  composed: "bg-sky-50 text-sky-700 ring-sky-200",
  direct:   "bg-orange-50 text-orange-700 ring-orange-200",
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const activeTab    = searchParams.get("tab") || "manage";

  const [products,   setProducts]   = useState<POSProduct[]>(seedProducts);
  const [categories]                = useState<Category[]>(seedCategories);
  const [recipes,    setRecipes]    = useState<Recipe[]>(seedRecipes);
  const [inventory]                 = useState<InventoryProduct[]>(seedInventory);

  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

  const [newProd, setNewProd] = useState({
    name: "", description: "", price: "",
    categoryId: "", sourceType: "composed" as "composed" | "direct",
  });

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(), name: newProd.name, description: newProd.description,
        price: Number(newProd.price),
        categoryId: newProd.categoryId ? Number(newProd.categoryId) : null,
        sourceType: newProd.sourceType, active: true,
      },
    ]);
    setNewProd({ name: "", description: "", price: "", categoryId: "", sourceType: "composed" });
    router.push("/products?tab=manage");
  };

  const handleDeleteProduct  = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setRecipes((prev)  => prev.filter((r) => r.posProductId !== id));
  };
  const handleArchiveProduct = (id: number) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));

  const handleSaveRecipe = (productId: number, name: string, ingredients: RecipeIngredient[]) => {
    const existing = recipes.find((r) => r.posProductId === productId);
    if (existing) {
      setRecipes((prev) => prev.map((r) => (r.posProductId === productId ? { ...r, name, ingredients } : r)));
    } else {
      setRecipes((prev) => [...prev, { id: Date.now(), posProductId: productId, name, ingredients }]);
    }
  };

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden bg-zinc-50/30">
      {/* Page Header */}
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Products Catalog</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Manage items, add new products, and configure recipes.</p>
        </div>
        {activeTab === "manage" && (
          <button
            onClick={() => router.push("/products?tab=add")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" /> New Product
          </button>
        )}
      </div>

      {/* Tab Pills */}
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-3 flex items-center gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => router.push(`/products?tab=${t.key}`)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              activeTab === t.key
                ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                : "bg-zinc-100/80 text-zinc-600 border-zinc-200 hover:bg-zinc-200/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MANAGE TAB ── */}
      {activeTab === "manage" && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Filters */}
          <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-3 flex items-center gap-3">
            <div className="relative flex-1 min-w-44 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 size-4 text-zinc-400" />
              <Input
                placeholder="Search products…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 h-9 text-sm border-zinc-200 focus-visible:ring-zinc-400 bg-zinc-50/50"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 transition-colors">
                  <X className="size-4" />
                </button>
              )}
            </div>
            <span className="ml-auto text-xs text-zinc-400 font-medium shrink-0">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Table Container */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-2.5 border-b border-zinc-200 bg-zinc-50/50">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Product</span>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Category</span>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">Source</span>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-right">Price</span>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">Status</span>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">Actions</span>
              </div>

              {paginated.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 text-sm">No products found.</div>
              ) : (
                paginated.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <div
                      key={p.id}
                      className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3.5 border-b border-zinc-100 last:border-none hover:bg-zinc-50/40 transition-colors items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-zinc-800">{p.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{p.description}</p>
                      </div>
                      <span className="text-sm text-zinc-600">{cat?.name || "Uncategorized"}</span>
                      <div className="flex justify-center">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ring-1 ${SOURCE_STYLES[p.sourceType]}`}>
                          {p.sourceType}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-zinc-900 text-right">₱{p.price.toFixed(2)}</span>
                      <div className="flex justify-center">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ring-1 ${
                          p.active
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-zinc-100 text-zinc-500 ring-zinc-200"
                        }`}>
                          {p.active ? "Active" : "Archived"}
                        </span>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleArchiveProduct(p.id)}
                          title={p.active ? "Archive" : "Unarchive"}
                          className="text-zinc-400 hover:text-amber-600 transition-colors"
                        >
                          <Archive className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          title="Delete"
                          className="text-zinc-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-3 text-xs text-zinc-400">
                <span>Page {page} of {totalPages}</span>
                <div className="flex gap-1.5">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 rounded bg-white border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 rounded bg-white border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD PRODUCT TAB ── */}
      {activeTab === "add" && (
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <div className="bg-white border border-zinc-200 rounded-lg p-6 max-w-lg shadow-xs">
            <h2 className="text-base font-semibold text-zinc-900 mb-4">Create New Product</h2>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Product Name <span className="text-rose-400">*</span></label>
                <Input
                  required
                  placeholder="e.g. Vanilla Cappuccino"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="h-9 text-sm border-zinc-200 focus-visible:ring-zinc-400 bg-zinc-50/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Description</label>
                <Input
                  placeholder="Short description"
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="h-9 text-sm border-zinc-200 focus-visible:ring-zinc-400 bg-zinc-50/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-500 mb-1 block">Price (₱) <span className="text-rose-400">*</span></label>
                  <Input
                    required type="number" placeholder="145"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    className="h-9 text-sm border-zinc-200 focus-visible:ring-zinc-400 bg-zinc-50/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 mb-1 block">Category</label>
                  <select
                    value={newProd.categoryId}
                    onChange={(e) => setNewProd({ ...newProd, categoryId: e.target.value })}
                    className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Source Type</label>
                <select
                  value={newProd.sourceType}
                  onChange={(e) => setNewProd({ ...newProd, sourceType: e.target.value as "composed" | "direct" })}
                  className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                >
                  <option value="composed">Composed — has recipe &amp; deducts inventory</option>
                  <option value="direct">Direct — ready-made / no recipe</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 shadow-sm transition-colors cursor-pointer"
                >
                  <Check className="size-3.5" /> Save Product
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/products?tab=manage")}
                  className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RECIPES TAB ── */}
      {activeTab === "recipes" && (
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-4 py-2.5 border-b border-zinc-200 bg-zinc-50/50">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Product</span>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Active Recipe</span>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">Ingredients</span>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">Manage</span>
            </div>
            {products
              .filter((p) => p.sourceType === "composed")
              .map((p) => {
                const recipe = recipes.find((r) => r.posProductId === p.id);
                return (
                  <div
                    key={p.id}
                    className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-4 py-3.5 border-b border-zinc-100 last:border-none hover:bg-zinc-50/40 transition-colors items-center"
                  >
                    <span className="text-sm font-semibold text-zinc-800">{p.name}</span>
                    <span className="text-sm text-zinc-500 italic">
                      {recipe?.name || <span className="text-zinc-300">No recipe yet</span>}
                    </span>
                    <span className="text-sm text-zinc-600 text-center">
                      {recipe?.ingredients.length ?? 0}
                    </span>
                    <div className="flex justify-center">
                      <ManageRecipeDialog
                        product={p}
                        inventory={inventory}
                        existingRecipe={recipe}
                        onSave={(name, ingredients) => handleSaveRecipe(p.id, name, ingredients)}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-400">Loading…</div>}>
      <ProductsContent />
    </Suspense>
  );
}
