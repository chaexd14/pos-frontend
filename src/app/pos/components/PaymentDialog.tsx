"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentDialogProps {
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onPreviewReceipt: () => void;
  onComplete: (paymentMethod: string, amountReceived: string) => void;
}

export function PaymentDialog({
  total,
  isOpen,
  onClose,
  onPreviewReceipt,
  onComplete,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountReceived, setAmountReceived] = useState("");

  // Reset inputs when dialog opens
  useEffect(() => {
    if (isOpen) {
      setPaymentMethod("Cash");
      setAmountReceived("");
    }
  }, [isOpen]);

  const change = Number(amountReceived || 0) - total;

  const handleComplete = () => {
    onComplete(paymentMethod, amountReceived);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-lg border p-4">
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="font-bold">₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <p className="font-medium mb-3">Payment Method</p>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Cash" id="cash" />
                <label htmlFor="cash">Cash</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="GCash" id="gcash" />
                <label htmlFor="gcash">GCash</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Maya" id="maya" />
                <label htmlFor="maya">Maya</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Card" id="card" />
                <label htmlFor="card">Card</label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "Cash" && (
            <>
              <div>
                <label className="text-sm font-medium">Amount Received</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                />
              </div>

              <div className="rounded-lg bg-muted p-3">
                <div className="flex justify-between">
                  <span>Change</span>
                  <span className="font-bold">
                    ₱{change > 0 ? change.toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            </>
          )}

          {paymentMethod !== "Cash" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Reference Number</label>
                <Input placeholder="Enter reference number" />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onPreviewReceipt}>
            Preview Receipt
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleComplete}>Complete Sale</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
