export interface User {
  _id: string;
  name: string;
  email: string;
  isSeller: boolean;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image: string;
}