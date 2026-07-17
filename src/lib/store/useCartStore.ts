import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  userLocation: {
    province: string;
    city: string;
  } | null;
  
  // Cart Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Location Actions
  setLocation: (province: string, city: string) => void;
  clearLocation: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      userLocation: null,
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.productId === item.productId);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.productId === item.productId 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          };
        }
        return { items: [...state.items, { ...item, id: Math.random().toString(36).substr(2, 9) }] };
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
      })),
      
      clearCart: () => set({ items: [] }),
      
      setLocation: (province, city) => set((state) => {
        // If the city changes, clear the cart (City-Based Sales Limiter logic)
        if (state.userLocation && (state.userLocation.city !== city || state.userLocation.province !== province)) {
          return {
            userLocation: { province, city },
            items: [] // Clear cart to prevent bypassing restrictions
          };
        }
        return { userLocation: { province, city } };
      }),
      
      clearLocation: () => set({ userLocation: null, items: [] })
    }),
    {
      name: 'exirsaz-cart-storage',
    }
  )
);
