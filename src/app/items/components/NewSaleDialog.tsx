"use client";

import { useState } from "react";
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
import { POSProduct, InventoryProduct, Recipe } from "../types";

const VAT_RATE = 0.12;

interface NewSaleDialogProps {
  products: POSProduct[];
  inventory: InventoryProduct[];
  recipes: Recipe[];
  onCompleteSale: (
    ledgerEntries: { kind: string; name: string; delta: number; unit: string }[]
  ) => void;
}

export function NewSaleDialog({
  products,
  inventory,
  recipes,
  onCompleteSale,
}: NewSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [saleItems, setSaleItems] = useState<{ productId: string; qty: string }[]>([
    { productId: "", qty: "1" },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const saleSubtotal = saleItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === Number(item.productId));
    return sum + (product ? product.price * Number(item.qty || 0) : 0);
  }, 0);

  const saleVat = saleSubtotal * VAT_RATE;
  const saleTotal = saleSubtotal + saleVat;

  const handleComplete = () => {
    const entries: { kind: string; name: string; delta: number; unit: string }[] = [];

    saleItems.forEach((item) => {
      const product = products.find((p) => p.id === Number(item.productId));
      if (!product) return;
      const qty = Number(item.qty || 0);
      const recipe = recipes.find((r) => r.posProductId === product.id);
      if (!recipe) return;

      recipe.ingredients.forEach((ing) => {
        const invProduct = inventory.find((i) => i.id === ing.inventoryProductId);
        if (!invProduct) return;
        entries.push({
          kind: "pos_sale",
          name: invProduct.name,
          delta: -(ing.quantity * qty),
          unit: ing.unit,
        });
      });
    });

    onCompleteSale(entries);
    setSaleItems([{ productId: "", qty: "1" }]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">New Sale</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Sale</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Customer</label>
              <Input defaultValue="Walk-in" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">
                Payment Method
              </label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="GCash">GCash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Items</label>
            {saleItems.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Select
                  value={item.productId}
                  onValueChange={(v) =>
                    setSaleItems((prev) =>
                      prev.map((r, i) => (i === idx ? { ...r, productId: v } : r))
                    )
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products
                      .filter((p) => p.active)
                      .map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name} — ₱{p.price}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  className="w-20"
                  min={1}
                  value={item.qty}
                  onChange={(e) =>
                    setSaleItems((prev) =>
                      prev.map((r, i) => (i === idx ? { ...r, qty: e.target.value } : r))
                    )
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSaleItems((prev) => prev.filter((_, i) => i !== idx))
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
                setSaleItems((prev) => [...prev, { productId: "", qty: "1" }])
              }
            >
              + Add Item
            </Button>
          </div>

          {/* Totals */}
          <div className="rounded-lg border p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₱{saleSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT (12%)</span>
              <span>₱{saleVat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>Total</span>
              <span>₱{saleTotal.toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full" onClick={handleComplete}>
            Complete Sale & Deduct Inventory
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
