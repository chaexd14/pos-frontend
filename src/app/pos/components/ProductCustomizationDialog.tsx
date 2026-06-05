"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Product, Addon } from "../types";

interface ProductCustomizationDialogProps {
  product: Product | null;
  addons: Addon[];
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (customization: {
    qty: number;
    size: string;
    notes: string;
    addons: string[];
    price: number;
  }) => void;
}

export function ProductCustomizationDialog({
  product,
  addons,
  isOpen,
  onClose,
  onAddToOrder,
}: ProductCustomizationDialogProps) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Reset local form states when dialog opens or product changes
  useEffect(() => {
    if (isOpen) {
      setQty(1);
      setSize("Medium");
      setNotes("");
      setSelectedAddons([]);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const addonPrice = selectedAddons.reduce((sum, addonName) => {
    const addon = addons.find((a) => a.name === addonName);
    return sum + (addon?.price || 0);
  }, 0);

  const itemPrice = product.price + addonPrice;
  const productTotal = itemPrice * qty;

  const toggleAddon = (name: string) => {
    if (selectedAddons.includes(name)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== name));
    } else {
      setSelectedAddons([...selectedAddons, name]);
    }
  };

  const handleAdd = () => {
    onAddToOrder({
      qty,
      size,
      notes,
      addons: selectedAddons,
      price: itemPrice,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="h-36 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-6xl">
            ☕
          </div>

          {/* QUANTITY */}
          <div>
            <p className="font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              >
                -
              </Button>
              <span className="font-semibold text-lg min-w-[40px] text-center">
                {qty}
              </span>
              <Button variant="outline" onClick={() => setQty((prev) => prev + 1)}>
                +
              </Button>
            </div>
          </div>

          {/* SIZE */}
          <div>
            <p className="font-medium mb-3">Size</p>
            <RadioGroup value={size} onValueChange={setSize}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Small" id="small" />
                <label htmlFor="small">Small</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Medium" id="medium" />
                <label htmlFor="medium">Medium</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Large" id="large" />
                <label htmlFor="large">Large</label>
              </div>
            </RadioGroup>
          </div>

          {/* ADDONS */}
          <div>
            <p className="font-medium mb-3">Add-ons</p>
            <div className="space-y-2">
              {addons.map((addon) => (
                <label
                  key={addon.name}
                  className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-muted/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedAddons.includes(addon.name)}
                      onChange={() => toggleAddon(addon.name)}
                    />
                    <span>{addon.name}</span>
                  </div>
                  <span>+₱{addon.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* NOTES */}
          <div>
            <p className="font-medium mb-2">Notes</p>
            <Textarea
              placeholder="Less ice, no sugar, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* TOTAL */}
          <div className="rounded-xl border p-4 bg-muted/50">
            <div className="flex justify-between items-center">
              <span className="font-medium">Item Total</span>
              <span className="text-xl font-bold">
                ₱{productTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add To Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
