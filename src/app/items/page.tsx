/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Trash2, Archive } from "lucide-react";

import { Category, InventoryProduct, POSProduct, Recipe, RecipeIngredient } from "./types";
import { AddCategoryDialog } from "./components/AddCategoryDialog";
import { AddProductDialog } from "./components/AddProductDialog";
import { NewSaleDialog } from "./components/NewSaleDialog";
import { ManageRecipeDialog } from "./components/ManageRecipeDialog";

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedInventory: InventoryProduct[] = [
  { id: 1, name: "Coffee Beans", description: "Arabica beans",  unit: "grams" },
  { id: 2, name: "Milk",         description: "Fresh milk",     unit: "ml"    },
  { id: 3, name: "Sugar",        description: "White sugar",    unit: "grams" },
  { id: 4, name: "Ice",          description: "Ice cubes",      unit: "grams" },
  { id: 5, name: "Sugar Syrup",  description: "Sweetener base", unit: "ml"    },
];

const seedCategories: Category[] = [
  { id: 1, name: "Beverages", description: "Drinks and refreshments" },
];

const seedProducts: POSProduct[] = [
  { id: 1, name: "Iced Coffee", description: "Cold brewed coffee",  price: 120, categoryId: 1, sourceType: "composed", active: true },
  { id: 2, name: "Latte",       description: "Milk espresso blend", price: 130, categoryId: 1, sourceType: "composed", active: true },
];

const seedRecipes: Recipe[] = [
  {
    id: 1, posProductId: 1, name: "Standard Iced Coffee",
    ingredients: [
      { inventoryProductId: 1, quantity: 20,  unit: "grams" },
      { inventoryProductId: 2, quantity: 150, unit: "ml"    },
      { inventoryProductId: 3, quantity: 10,  unit: "grams" },
      { inventoryProductId: 4, quantity: 200, unit: "grams" },
    ],
  },
];

const PAGE_SIZE = 8;

const SOURCE_STYLES: Record<string, string> = {
  composed: "bg-sky-50 text-sky-700 ring-sky-200",
  direct:   "bg-orange-50 text-orange-700 ring-orange-200",
};

export default function ItemsPage() {
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [inventory]                 = useState<InventoryProduct[]>(seedInventory);
  const [products,   setProducts]   = useState<POSProduct[]>(seedProducts);
  const [recipes,    setRecipes]    = useState<Recipe[]>(seedRecipes);

  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

  const [ledger, setLedger] = useState<{ kind: string; name: string; delta: number; unit: string }[]>([]);

  const handleSaveCategory = (name: string, description: string) => {
    setCategories((p) => [...p, { id: Date.now(), name, description }]);
  };

  const handleSaveProduct = (prod: {
    name: string; description: string; price: number;
    categoryId: number | null; sourceType: "composed" | "direct";
  }) => {
    setProducts((p) => [...p, { id: Date.now(), ...prod, active: true }]);
  };

  const handleDeleteProduct  = (id: number) => {
    setProducts((p) => p.filter((x) => x.id !== id));
    setRecipes((p)  => p.filter((r) => r.posProductId !== id));
  };
  const handleArchiveProduct = (id: number) =>
    setProducts((p) => p.map((x) => x.id === id ? { ...x, active: !x.active } : x));

  const handleSaveRecipe = (productId: number, name: string, ingredients: RecipeIngredient[]) => {
    const existing = recipes.find((r) => r.posProductId === productId);
    if (existing) {
      setRecipes((p) => p.map((r) => r.posProductId === productId ? { ...r, name, ingredients } : r));
    } else {
      setRecipes((p) => [...p, { id: Date.now(), posProductId: productId, name, ingredients }]);
    }
  };

  const handleCompleteSale = (entries: typeof ledger) =>
    setLedger((p) => [...p, ...entries]);

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
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Product Management</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Categories, products, recipes, and new sales.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <AddCategoryDialog onSave={handleSaveCategory} />
          <AddProductDialog categories={categories} onSave={handleSaveProduct} />
          <NewSaleDialog
            products={products}
            inventory={inventory}
            recipes={recipes}
            onCompleteSale={handleCompleteSale}
          />
        </div>
      </div>

      {/* Search */}
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

      {/* Table & Log (SCROLLABLE AREA) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
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
            paginated.map((product) => {
              const cat    = categories.find((c) => c.id === product.categoryId);
              const recipe = recipes.find((r) => r.posProductId === product.id);
              return (
                <div
                  key={product.id}
                  className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3.5 border-b border-zinc-100 last:border-none hover:bg-zinc-50/40 transition-colors items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">{product.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{product.description}</p>
                    {recipe && (
                      <p className="text-[11px] text-sky-600 font-medium mt-0.5">Recipe: {recipe.name}</p>
                    )}
                  </div>
                  <span className="text-sm text-zinc-600">{cat?.name ?? <span className="text-zinc-400 italic">None</span>}</span>
                  <div className="flex justify-center">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ring-1 ${SOURCE_STYLES[product.sourceType]}`}>
                      {product.sourceType}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-zinc-900 text-right">₱{product.price.toFixed(2)}</span>
                  <div className="flex justify-center">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ring-1 ${
                      product.active
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : "bg-zinc-100 text-zinc-500 ring-zinc-200"
                    }`}>
                      {product.active ? "Active" : "Archived"}
                    </span>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    {product.sourceType === "composed" && (
                      <ManageRecipeDialog
                        product={product}
                        inventory={inventory}
                        existingRecipe={recipe}
                        onSave={(name, ingredients) => handleSaveRecipe(product.id, name, ingredients)}
                      />
                    )}
                    <button
                      onClick={() => handleArchiveProduct(product.id)}
                      title={product.active ? "Archive" : "Unarchive"}
                      className="text-zinc-400 hover:text-amber-600 transition-colors"
                    >
                      <Archive className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
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
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded bg-white border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
              >Prev</button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded bg-white border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
              >Next</button>
            </div>
          </div>
        )}

        {/* Inventory Ledger */}
        {ledger.length > 0 && (
          <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50/50">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Inventory Deduction Log</p>
            </div>
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-4 py-2.5 border-b border-zinc-200 bg-zinc-50/50">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Event</span>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Item</span>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide text-right">Delta</span>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide text-right">Unit</span>
            </div>
            {ledger.map((entry, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-4 py-3 border-b border-zinc-100 last:border-none text-sm"
              >
                <span className="text-zinc-400 text-xs">{entry.kind}</span>
                <span className="text-zinc-700">{entry.name}</span>
                <span className="text-rose-500 font-semibold text-right">{entry.delta}</span>
                <span className="text-zinc-400 text-right">{entry.unit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}