export interface Category {
  id: string;
  name: string;
}

export interface Seller {
  id: string;
  name: string;
  username: string;
  whatsapp: string;
  bio: string | null;
  avatar: string | null;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage: string;
  fileUrl: string | null;
  isActive: boolean;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithSeller extends Product {
  seller: Seller;
}

export interface SellerWithProducts extends Seller {
  products: Product[];
}
