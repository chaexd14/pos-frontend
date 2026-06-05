"use client"; import { useMemo, useState } from "react"; import { Input } from "@/components/ui/input"; import { Search, X, Minus, Plus, Trash2, ShoppingCart, Coffee, Tag } from "lucide-react"; import { OrderItem, Product, Addon } from "./types"; import { ProductCustomizationDialog } from "./components/ProductCustomizationDialog"; import { PaymentDialog } from "./components/PaymentDialog"; import { ReceiptDialog } from "./components/ReceiptDialog"; /* ─── Mock data ──────────────────────────────────────────────────────────── */ const products: Product[] = [{ id: 1, name: "Americano", price: 90, category: "Hot" }, { id: 2, name: "Cappuccino", price: 120, category: "Hot" }, { id: 3, name: "Latte", price: 130, category: "Hot" }, { id: 4, name: "Mocha", price: 140, category: "Hot" }, { id: 5, name: "Espresso", price: 80, category: "Hot" }, { id: 6, name: "Macchiato", price: 110, category: "Hot" }, { id: 7, name: "Flat White", price: 135, category: "Hot" }, { id: 8, name: "Iced Coffee", price: 100, category: "Iced" }, { id: 9, name: "Iced Latte", price: 130, category: "Iced" }, { id: 10, name: "Iced Mocha", price: 140, category: "Iced" }, { id: 11, name: "Caramel Macchiato", price: 150, category: "Specialty" }, { id: 12, name: "Matcha Latte", price: 155, category: "Specialty" }, { id: 13, name: "Toffee Nut", price: 160, category: "Specialty" }, { id: 14, name: "Hazelnut Latte", price: 150, category: "Specialty" }, { id: 15, name: "Hazelnut Latte", price: 150, category: "Specialty" }, { id: 16, name: "Hazelnut Latte", price: 150, category: "Specialty" }, { id: 17, name: "Hazelnut Latte", price: 150, category: "Specialty" }, { id: 18, name: "Hazelnut Latte", price: 150, category: "Specialty" }, { id: 19, name: "Hazelnut Latte", price: 150, category: "Specialty" }, { id: 20, name: "Hazelnut Latte", price: 150, category: "Specialty" },]; const categories = ["All", "Hot", "Iced", "Specialty"]; const addons: Addon[] = [{ name: "Extra Shot", price: 20 }, { name: "Oat Milk", price: 25 }, { name: "Whipped Cream", price: 15 },]; const CATEGORY_EMOJI: Record<string, string> = { Hot: "☕", Iced: "🧊", Specialty: "⭐", All: "✨", }; const DISCOUNT_OPTIONS = [{ label: "No Discount", value: "none" }, { label: "Senior (20%)", value: "Senior" }, { label: "PWD (20%)", value: "PWD" }, { label: "Custom", value: "custom" },]; /* ─── Component ──────────────────────────────────────────────────────────── */ export default function POSPage() { /* state */ const [search, setSearch] = useState(""); const [category, setCategory] = useState("All"); const [orderItems, setOrderItems] = useState<OrderItem[]>([]); const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); const [productDialog, setProductDialog] = useState(false); const [paymentDialog, setPaymentDialog] = useState(false); const [receiptDialog, setReceiptDialog] = useState(false); const [discountType, setDiscountType] = useState("none"); const [customDiscount, setCustomDiscount] = useState(""); const [paymentMethod, setPaymentMethod] = useState("Cash"); const [amountReceived, setAmountReceived] = useState(""); /* derived */ const filteredProducts = useMemo(() => products.filter((p) => { const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()); const matchCat = category === "All" || p.category === category; return matchSearch && matchCat; }), [search, category]); const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0); const discountPercent = discountType === "Senior" || discountType === "PWD" ? 0.2 : discountType === "custom" ? Math.min(100, Math.max(0, Number(customDiscount || 0))) / 100 : 0; const discountAmount = subtotal * discountPercent; const discountedSubtotal = Math.max(0, subtotal - discountAmount); const tax = discountedSubtotal * 0.12; const total = discountedSubtotal + tax; /* handlers */ function openProduct(p: Product) { setSelectedProduct(p); setProductDialog(true); } function handleAddToOrder(c: { qty: number; size: string; notes: string; addons: string[]; price: number }) { if (!selectedProduct) return; setOrderItems((prev) => [...prev, { id: Date.now(), name: selectedProduct.name, qty: c.qty, size: c.size, notes: c.notes, addons: c.addons, price: c.price },]); setProductDialog(false); } function increaseQty(id: number) { setOrderItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))); } function decreaseQty(id: number) { setOrderItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0),); } function removeItem(id: number) { setOrderItems((prev) => prev.filter((i) => i.id !== id)); } function handleCompletePayment(method: string, amt: string) { setPaymentMethod(method); setAmountReceived(amt); setPaymentDialog(false); }

  return (
    <div className="h-full w-full grid grid-cols-4 overflow-hidden">

      {/* LEFT SIDE (PRODUCTS) */}
      <section className="col-span-3 flex flex-col overflow-hidden border-r">

        {/* TOP CONTROLS (fixed) */}
        <div className="shrink-0 flex flex-col gap-2 p-3 border-b bg-white">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-9 h-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-xs border transition ${category === c
                  ? "bg-black text-white"
                  : "bg-white text-zinc-600"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID (ONLY SCROLL AREA) */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-4 gap-3">

            {filteredProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-zinc-400 gap-3">
                <Coffee className="size-10 opacity-30" />
                <p className="text-sm font-medium">No products found</p>
              </div>
            ) : (
              filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openProduct(p)}
                  className="
                    group relative bg-white rounded-2xl border border-zinc-200 p-4 text-left
                    hover:border-zinc-400 hover:shadow-md active:scale-[0.98]
                    transition-all duration-150 focus:outline-none focus-visible:ring-2
                    focus-visible:ring-zinc-400 focus-visible:ring-offset-1
                  "
                >
                  {/* Category badge */}
                  <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-full">
                    {p.category}
                  </span>

                  {/* Icon */}
                  <div className="h-20 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl mb-3 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-200">
                    {p.category}
                  </div>

                  {/* Name */}
                  <div className="text-sm font-semibold text-zinc-800 leading-tight mb-0.5 pr-6">
                    {p.name}
                  </div>

                  {/* Price */}
                  <div className="text-base font-bold text-zinc-900">
                    ₱{p.price.toFixed(2)}
                  </div>
                </button>
              ))
            )}

          </div>
        </div>
      </section>

      {/* RIGHT SIDE (ORDER PANEL - READY FOR SCROLL LATER) */}
      <section className="col-span-1 flex flex-col overflow-hidden">

        <div className="shrink-0 px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-800 text-sm">Current Order</span>
            {orderItems.length > 0 && (
              <span className="bg-zinc-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {orderItems.length}
              </span>
            )}
          </div>
          {orderItems.length > 0 && (
            <button
              onClick={() => setOrderItems([])}
              className="text-xs text-zinc-400 hover:text-rose-500 font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Order items list */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            {orderItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
                <ShoppingCart className="size-10 opacity-25" />
                <p className="text-sm font-medium">Add items to start an order</p>
              </div>
            ) : (
              orderItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 hover:border-zinc-300 transition-colors"
                >
                  {/* Row 1: name + remove */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-800 leading-tight truncate">
                        {item.name}
                        {item.size && (
                          <span className="ml-1 text-xs font-medium text-zinc-400">({item.size})</span>
                        )}
                      </p>
                      {item.addons.length > 0 && (
                        <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                          + {item.addons.join(", ")}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-[11px] text-zinc-400 italic mt-0.5 truncate">
                          &ldquo;{item.notes}&rdquo;
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 mt-0.5 text-zinc-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  {/* Row 2: qty controls + line total */}
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-200">
                    <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-2.5 py-1 text-zinc-500 hover:bg-zinc-100 transition-colors"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-zinc-700">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-2.5 py-1 text-zinc-500 hover:bg-zinc-100 transition-colors"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-zinc-800">
                      ₱{(item.qty * item.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Discount selector */}
        <div className="shrink-0 border-t border-zinc-100 px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="size-3.5 text-zinc-400" />
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Discount</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {DISCOUNT_OPTIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => setDiscountType(d.value)}
                className={`
                  px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all
                  ${discountType === d.value
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-400"
                  }
                `}
              >
                {d.label}
              </button>
            ))}
          </div>
          {discountType === "custom" && (
            <div className="relative mt-2">
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="Enter % (e.g. 10)"
                value={customDiscount}
                onChange={(e) => setCustomDiscount(e.target.value)}
                className="h-8 text-sm pr-8 border-zinc-200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium">%</span>
            </div>
          )}
        </div>

        {/* Totals + checkout */}
        <div className="shrink-0 border-t border-zinc-200 px-4 py-4 space-y-2 bg-zinc-50">
          <div className="flex justify-between text-sm text-zinc-500">
            <span>Subtotal</span>
            <span className="font-medium text-zinc-700">₱{subtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-rose-500">
              <span>Discount ({(discountPercent * 100).toFixed(0)}%)</span>
              <span className="font-semibold">−₱{discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm text-zinc-500">
            <span>VAT (12%)</span>
            <span className="font-medium text-zinc-700">₱{tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-base font-bold text-zinc-900 pt-2 border-t border-zinc-200">
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>

          <button
            disabled={orderItems.length === 0}
            onClick={() => setPaymentDialog(true)}
            className="
              w-full mt-1 py-3 rounded-xl text-sm font-semibold tracking-wide
              bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.99]
              transition-all shadow-sm
              disabled:opacity-40 disabled:pointer-events-none
            "
          >
            Proceed to Checkout →
          </button>
        </div>
      </section>

      <ProductCustomizationDialog
        product={selectedProduct}
        addons={addons}
        isOpen={productDialog}
        onClose={() => setProductDialog(false)}
        onAddToOrder={handleAddToOrder}
      />

      <PaymentDialog
        total={total}
        isOpen={paymentDialog}
        onClose={() => setPaymentDialog(false)}
        onPreviewReceipt={() => setReceiptDialog(true)}
        onComplete={handleCompletePayment}
      />

      <ReceiptDialog
        isOpen={receiptDialog}
        onClose={() => setReceiptDialog(false)}
        orderItems={orderItems}
        subtotal={subtotal}
        discountAmount={discountAmount}
        discountPercent={discountPercent}
        tax={tax}
        total={total}
        paymentMethod={paymentMethod}
        amountReceived={amountReceived}
        onConfirmAndClear={() => {
          setReceiptDialog(false);
          setOrderItems([]);
        }}
      />
    </div>
  );
}