export interface Product {
  id: number;
  price: number;
  stok: number;
  name: string;
  slug: string;
  is_popular: boolean;
  category: Category;
  thumbnail: string;
  benefits: Benefit[];
  testimonials: Testimonial[];
  about: string;
}

interface Benefit {
  id: number;
  name: string;
}

interface Testimonial {
  id: number;
  name: string;
  message: string;
  photo: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  photo: string;
  products_count: number;
  products: Product[]; 
  popular_products: Product[]; 
}

export interface OrderDetails {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  post_code: string;
  city: string;
  Order_trx_id: string;
  is_paid: boolean;
  sub_total: number;
  total_tax_amount: number;
  total_amount: number;
  started_time: string;
  schedule_at: string;
  transaction_details: TransactionDetails[]; // This implies an array of TransactionDetails
  proof: string | null; // Assuming this is a URL or path to the proof of payment
}

interface TransactionDetails {
  id: number;
  price: number; // This might be a number if it's a monetary value. Adjust if necessary.
  product_id: number;
  product: Product; // Assuming HomeService interface is defined elsewhere
}

export interface CartItem {
  product_id: number;
  slug: string;
  quantity: number;
}

export type OrderFormData = {
  name: string;
  email: string;
  phone: string;
  started_time: string;
  schedule_at: string;
  post_code: string;
  address: string;
  city: string;
  // Based on the StoreOrderTransactionRequest in PHP, these fields would also be expected:
  // proof: string; // or File if it's handled as a file object in the frontend
  // service_ids: number[];
};
