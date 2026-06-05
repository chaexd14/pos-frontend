export type Category = {
  id: number;
  name: string;
  description: string;
};

export type InventoryProduct = {
  id: number;
  name: string;
  description: string;
  unit: string;
};

export type POSProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
  sourceType: "composed" | "direct";
  active: boolean;
};

export type RecipeIngredient = {
  inventoryProductId: number;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: number;
  posProductId: number;
  name: string;
  ingredients: RecipeIngredient[];
};

export type OrderItem = {
  productId: number;
  qty: number;
  price: number;
};
