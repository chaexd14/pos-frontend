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

interface AddCategoryDialogProps {
  onSave: (name: string, description: string) => void;
}

export function AddCategoryDialog({ onSave }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", description: "" });

  const handleSave = () => {
    if (!catForm.name) return;
    onSave(catForm.name, catForm.description);
    setCatForm({ name: "", description: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create POS Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Name</label>
            <Input
              placeholder="e.g. Beverages"
              value={catForm.name}
              onChange={(e) =>
                setCatForm({ ...catForm, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Description
            </label>
            <Input
              placeholder="Drinks and refreshments"
              value={catForm.description}
              onChange={(e) =>
                setCatForm({ ...catForm, description: e.target.value })
              }
            />
          </div>
          <Button className="w-full" onClick={handleSave}>
            Save Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
