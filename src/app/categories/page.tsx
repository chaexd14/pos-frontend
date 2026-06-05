"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil, X, Check, Search } from "lucide-react";

type Category = {
  id: number;
  name: string;
  description: string;
  productCount: number;
};

const initialCategories: Category[] = [
  { id: 1, name: "Beverages",    description: "Espresso, hot brew, iced teas, and juices", productCount: 7 },
  { id: 2, name: "Pastries",     description: "Freshly baked croissants, cakes, and cookies", productCount: 4 },
  { id: 3, name: "Sandwiches",   description: "Paninis, wraps, and savory croissants", productCount: 3 },
  { id: 4, name: "Coffee Beans", description: "Packaged whole bean coffee origins", productCount: 2 },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName]             = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [search, setSearch]         = useState("");
  const [showForm, setShowForm]     = useState(false);

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingId !== null) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, name: name.trim(), description: description.trim() } : c))
      );
    } else {
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), name: name.trim(), description: description.trim(), productCount: 0 },
      ]);
    }
    resetForm();
  };

  const handleEdit = (c: Category) => {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden bg-zinc-50/30">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Categories</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Organize your menu into groups.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" /> New Category
          </button>
        )}
      </div>

      {/* Inline Add / Edit Form */}
      {showForm && (
        <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4 shadow-xs">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">
            {editingId !== null ? "Edit Category" : "New Category"}
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-40">
              <label className="text-xs text-zinc-500 font-medium mb-1 block">Name</label>
              <Input
                placeholder="e.g. Desserts"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-sm border-zinc-200 focus-visible:ring-zinc-400 bg-zinc-50/50"
              />
            </div>
            <div className="flex-[2] min-w-48">
              <label className="text-xs text-zinc-500 font-medium mb-1 block">Description</label>
              <Input
                placeholder="e.g. Sweet cakes, pastries, and ice creams"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-9 text-sm border-zinc-200 focus-visible:ring-zinc-400 bg-zinc-50/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 shadow-sm transition-colors h-9 cursor-pointer"
              >
                <Check className="size-3.5" />
                {editingId !== null ? "Update" : "Save"}
              </button>
              <button
                onClick={resetForm}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-semibold hover:bg-zinc-200 transition-colors h-9 cursor-pointer"
              >
                <X className="size-3.5" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-3 flex items-center gap-3">
        <div className="relative flex-1 min-w-44 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-zinc-400" />
          <Input
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm border-zinc-200 focus-visible:ring-zinc-400 bg-zinc-50/50"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 transition-colors">
              <X className="size-4" />
            </button>
          )}
        </div>
        <span className="text-xs text-zinc-400 font-medium shrink-0 ml-auto">
          {filtered.length} categor{filtered.length !== 1 ? "ies" : "y"}
        </span>
      </div>

      {/* Ledger Table */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
          {/* Header Row */}
          <div className="grid grid-cols-[2fr_3fr_1fr_1fr] gap-4 px-4 py-2.5 border-b border-zinc-200 bg-zinc-50/50">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Name</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Description</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">Products</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">No categories found.</div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[2fr_3fr_1fr_1fr] gap-4 px-4 py-3.5 border-b border-zinc-100 last:border-none hover:bg-zinc-50/40 transition-colors items-center"
              >
                <span className="text-sm font-semibold text-zinc-800">{c.name}</span>
                <span className="text-sm text-zinc-500 truncate">{c.description}</span>
                <div className="flex justify-center">
                  <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">
                    {c.productCount} items
                  </span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-zinc-400 hover:text-zinc-700 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-zinc-400 hover:text-rose-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
