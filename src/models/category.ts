import { Product } from "./product";

export interface Category {
  id: string;
  name: string;
  order: number;
  products?: Product[]
}