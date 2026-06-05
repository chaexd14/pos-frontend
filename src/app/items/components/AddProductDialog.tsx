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
import { Category } from "../types";

interface AddProductDialogProps {
  categories: Category[];
  onSave: (product: {
    name: string;
    description: string;
    price: number;
    categoryId: number | null;
    sourceType: "composed" | "direct";
  }) => void;
}

export function AddProductDialog({ categories, onSave }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [prodForm, setProdForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    sourceType: "composed" as "composed" | "direct",
  });

  const handleSave = () => {
    if (!prodForm.name || !prodForm.price) return;
    onSave({
      name: prodForm.name,
      description: prodForm.description,
      price: Number(prodForm.price),
      categoryId: prodForm.categoryId ? Number(prodForm.categoryId) : null,
      sourceType: prodForm.sourceType,
    });
    setProdForm({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      sourceType: "composed",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create POS Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Name</label>
            <Input
              placeholder="e.g. Iced Coffee"
              value={prodForm.name}
              onChange={(e) =>
                setProdForm({ ...prodForm, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Description</label>
            <Input
              placeholder="Cold brewed coffee"
              value={prodForm.description}
              onChange={(e) =>
                setProdForm({ ...prodForm, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Selling Price (₱)
            </label>
            <Input
              type="number"
              placeholder="120"
              value={prodForm.price}
              onChange={(e) =>
                setProdForm({ ...prodForm, price: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Category</label>
            <Select
              value={prodForm.categoryId}
              onValueChange={(v) => setProdForm({ ...prodForm, categoryId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Source Type</label>
            <Select
              value={prodForm.sourceType}
              onValueChange={(v: "composed" | "direct") =>
                setProdForm({ ...prodForm, sourceType: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="composed">Composed (has recipe)</SelectItem>
                <SelectItem value="direct">Direct (no recipe)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleSave}>
            Save Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
