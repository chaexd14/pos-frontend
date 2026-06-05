"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POSProduct, InventoryProduct, Recipe, RecipeIngredient } from "../types";

interface ManageRecipeDialogProps {
  product: POSProduct;
  inventory: InventoryProduct[];
  existingRecipe: Recipe | undefined;
  onSave: (recipeName: string, ingredients: RecipeIngredient[]) => void;
}

export function ManageRecipeDialog({
  product,
  inventory,
  existingRecipe,
  onSave,
}: ManageRecipeDialogProps) {
  const [open, setOpen] = useState(false);
  const [recipeForm, setRecipeForm] = useState({ name: "" });
  const [ingredientRows, setIngredientRows] = useState<
    { inventoryProductId: string; quantity: string; unit: string }[]
  >([{ inventoryProductId: "", quantity: "", unit: "grams" }]);

  // Initialize or reset form when modal opens or existingRecipe changes
  useEffect(() => {
    if (open) {
      if (existingRecipe) {
        setRecipeForm({ name: existingRecipe.name });
        setIngredientRows(
          existingRecipe.ingredients.map((i) => ({
            inventoryProductId: String(i.inventoryProductId),
            quantity: String(i.quantity),
            unit: i.unit,
          }))
        );
      } else {
        setRecipeForm({ name: "" });
        setIngredientRows([{ inventoryProductId: "", quantity: "", unit: "grams" }]);
      }
    }
  }, [open, existingRecipe]);

  const handleSave = () => {
    if (!recipeForm.name) return;

    const ingredients = ingredientRows
      .filter((r) => r.inventoryProductId && r.quantity)
      .map((r) => ({
        inventoryProductId: Number(r.inventoryProductId),
        quantity: Number(r.quantity),
        unit: r.unit,
      }));

    onSave(recipeForm.name, ingredients);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Recipe — {product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Recipe Name</label>
            <Input
              placeholder="e.g. Standard Iced Coffee"
              value={recipeForm.name}
              onChange={(e) => setRecipeForm({ name: e.target.value })}
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Ingredients</label>
            <div className="grid grid-cols-[1fr_80px_100px_32px] gap-2 text-xs text-muted-foreground mb-1">
              <span>Inventory Item</span>
              <span>Qty</span>
              <span>Unit</span>
              <span />
            </div>
            {ingredientRows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-center"
              >
                <Select
                  value={row.inventoryProductId}
                  onValueChange={(v) =>
                    setIngredientRows((prev) =>
                      prev.map((r, i) =>
                        i === idx ? { ...r, inventoryProductId: v } : r
                      )
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventory.map((i) => (
                      <SelectItem key={i.id} value={String(i.id)}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0"
                  value={row.quantity}
                  onChange={(e) =>
                    setIngredientRows((prev) =>
                      prev.map((r, i) =>
                        i === idx ? { ...r, quantity: e.target.value } : r
                      )
                    )
                  }
                />
                <Select
                  value={row.unit}
                  onValueChange={(v) =>
                    setIngredientRows((prev) =>
                      prev.map((r, i) => (i === idx ? { ...r, unit: v } : r))
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["grams", "ml", "pcs", "oz", "kg", "l"].map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  onClick={() =>
                    setIngredientRows((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setIngredientRows((prev) => [
                  ...prev,
                  { inventoryProductId: "", quantity: "", unit: "grams" },
                ])
              }
            >
              + Add Ingredient
            </Button>
          </div>

          <Button className="w-full" onClick={handleSave}>
            Save Recipe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
