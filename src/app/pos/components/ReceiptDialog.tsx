"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { OrderItem } from "../types";

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  tax: number;
  total: number;
  paymentMethod: string;
  amountReceived: string;
  onConfirmAndClear: () => void;
}

export function ReceiptDialog({
  isOpen,
  onClose,
  orderItems,
  subtotal,
  discountAmount,
  discountPercent,
  tax,
  total,
  paymentMethod,
  amountReceived,
  onConfirmAndClear,
}: ReceiptDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-bold text-lg">Sample Cafe</h3>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleString()}
            </p>
          </div>

          <div className="border rounded p-3 space-y-2 max-h-60 overflow-y-auto">
            {orderItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">
                    {item.qty} x {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.size}{" "}
                    {item.addons.length > 0 && `+ ${item.addons.join(", ")}`}
                  </div>
                </div>
                <div className="font-semibold">
                  ₱{(item.qty * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-sm border-t pt-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount ({(discountPercent * 100).toFixed(0)}%)</span>
                <span>-₱{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT (12%)</span>
              <span>₱{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-1">
              <span>Total</span>
              <span>₱{total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>

            {paymentMethod === "Cash" && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Received</span>
                  <span>₱{Number(amountReceived || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-muted-foreground">Change</span>
                  <span>
                    ₱
                    {Number(amountReceived || 0) - total > 0
                      ? (Number(amountReceived || 0) - total).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onConfirmAndClear}>Confirm & Clear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
