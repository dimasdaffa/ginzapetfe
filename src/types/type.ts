export interface HomeService {
  id: number;
  price: number;
  duration: number;
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
  home_services_count: number;
  home_services: HomeService[]; // Assuming this is an array of HomeService
  popular_services: HomeService[]; // Assuming this is an array of HomeService
}

export interface BookingDetails {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  post_code: string;
  city: string;
  booking_trx_id: string;
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
  home_service_id: number;
  home_service: HomeService; // Assuming HomeService interface is defined elsewhere
}

export interface CartItem {
  service_id: number;
  slug: string;
  quantity: number;
}

export type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  started_time: string;
  schedule_at: string;
  post_code: string;
  address: string;
  city: string;
  // Based on the StoreBookingTransactionRequest in PHP, these fields would also be expected:
  // proof: string; // or File if it's handled as a file object in the frontend
  // service_ids: number[];
};
