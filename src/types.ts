export interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  category: 'fastfood' | 'bbq' | 'beverages' | 'desserts' | 'snacks';
  image: string;
  description: string;
  ingredients: string[];
  isBestSeller?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Reservation {
  id?: string;
  fullName: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  notes?: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

export interface Order {
  id?: string;
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled';
  userId: string;
  createdAt: any;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
