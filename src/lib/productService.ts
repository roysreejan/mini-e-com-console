import api from './api';

export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};