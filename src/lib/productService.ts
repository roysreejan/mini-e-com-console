import api from "./api";
export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await api.get("/products");
    return data?.data?.products ?? [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data?.data?.product ?? null;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
};