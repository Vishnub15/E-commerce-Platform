import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interfaces
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  countInStock: number;
  createdAt?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  countInStock: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  createdAt: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  allOrders: Order[];
  usersList: User[];
  loading: boolean;
  cartOpen: boolean;
  toast: Toast | null;
  setCartOpen: (open: boolean) => void;
  fetchProducts: (category?: string, search?: string) => Promise<void>;
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (productId: string) => void;
  changeCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  updateUserProfile: (name: string, email: string, password?: string) => Promise<boolean>;
  placeOrder: (shippingAddress: Order['shippingAddress']) => Promise<Order | null>;
  fetchMyOrders: () => Promise<void>;
  fetchAdminOrders: () => Promise<void>;
  fetchAdminUsers: () => Promise<void>;
  updateOrderToDelivered: (orderId: string, status?: string) => Promise<void>;
  adminCreateProduct: (productData: Omit<Product, 'id'>) => Promise<boolean>;
  adminUpdateProduct: (productId: string, productData: Partial<Product>) => Promise<boolean>;
  adminDeleteProduct: (productId: string) => Promise<boolean>;
  showToast: (message: string, type?: Toast['type']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Load User & Cart from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('aura_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('aura_user');
      }
    }

    const storedCart = localStorage.getItem('aura_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        localStorage.removeItem('aura_cart');
      }
    }
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast Helper
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Fetch Products
  const fetchProducts = async (category = '', search = '') => {
    setLoading(true);
    try {
      let url = `${API_BASE}/products`;
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add to Cart
  const addToCart = (product: Product, qty: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product.id);
      if (existingItem) {
        const newQty = Math.min(existingItem.qty + qty, product.countInStock);
        if (newQty === existingItem.qty && existingItem.qty >= product.countInStock) {
          showToast(`Only ${product.countInStock} items available in stock`, 'info');
          return prevCart;
        }
        showToast(`Updated qty for ${product.name} in cart`);
        return prevCart.map((item) =>
          item.productId === product.id ? { ...item, qty: newQty } : item
        );
      } else {
        showToast(`Added ${product.name} to cart`);
        return [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            qty,
            image: product.image,
            countInStock: product.countInStock,
          },
        ];
      }
    });
  };

  // Remove from Cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const item = prevCart.find(i => i.productId === productId);
      if (item) {
        showToast(`Removed ${item.name} from cart`, 'info');
      }
      return prevCart.filter((item) => item.productId !== productId);
    });
  };

  // Change Qty in Cart
  const changeCartQty = (productId: string, qty: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.productId === productId) {
          const validQty = Math.max(1, Math.min(qty, item.countInStock));
          return { ...item, qty: validQty };
        }
        return item;
      })
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
  };

  // Login
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      setUser(data);
      localStorage.setItem('aura_user', JSON.stringify(data));
      showToast(`Welcome back, ${data.name}!`);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setUser(data);
      localStorage.setItem('aura_user', JSON.stringify(data));
      showToast(`Account created successfully! Welcome ${data.name}`);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logoutUser = () => {
    setUser(null);
    setOrders([]);
    setAllOrders([]);
    setUsersList([]);
    localStorage.removeItem('aura_user');
    showToast('Logged out successfully', 'info');
  };

  // Update Profile
  const updateUserProfile = async (name: string, email: string, password?: string): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('aura_user', JSON.stringify(updatedUser));
      showToast('Profile updated successfully!');
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Place Order
  const placeOrder = async (shippingAddress: Order['shippingAddress']): Promise<Order | null> => {
    if (!user) {
      showToast('Please login to complete your order', 'error');
      return null;
    }
    setLoading(true);
    try {
      const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderItems: cart,
          shippingAddress,
          paymentMethod: 'Card',
          totalAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Checkout failed');

      clearCart();
      showToast('Order placed successfully! Payment approved.');
      // Refresh current catalog list to reflect decremented stock
      fetchProducts();
      return data;
    } catch (err: any) {
      showToast(err.message, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch My Orders
  const fetchMyOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders/myorders`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ADMIN: Fetch All Orders
  const fetchAdminOrders = async () => {
    if (!user || !user.isAdmin) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error('Failed to load system orders');
      const data = await res.json();
      setAllOrders(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ADMIN: Fetch All Users
  const fetchAdminUsers = async () => {
    if (!user || !user.isAdmin) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error('Failed to load users list');
      const data = await res.json();
      setUsersList(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ADMIN: Update Order Delivery status
  const updateOrderToDelivered = async (orderId: string, status = 'Delivered') => {
    if (!user || !user.isAdmin) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update order');

      showToast(`Order status updated to: ${status}`);
      // Refresh list
      fetchAdminOrders();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ADMIN: Create Product
  const adminCreateProduct = async (productData: Omit<Product, 'id'>): Promise<boolean> => {
    if (!user || !user.isAdmin) return false;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create product');

      showToast(`Product "${data.name}" created!`);
      fetchProducts();
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ADMIN: Update Product
  const adminUpdateProduct = async (productId: string, productData: Partial<Product>): Promise<boolean> => {
    if (!user || !user.isAdmin) return false;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update product');

      showToast(`Product updated successfully!`);
      fetchProducts();
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ADMIN: Delete Product
  const adminDeleteProduct = async (productId: string): Promise<boolean> => {
    if (!user || !user.isAdmin) return false;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete product');

      showToast(`Product removed.`);
      fetchProducts();
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        user,
        orders,
        allOrders,
        usersList,
        loading,
        cartOpen,
        toast,
        setCartOpen,
        fetchProducts,
        addToCart,
        removeFromCart,
        changeCartQty,
        clearCart,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        placeOrder,
        fetchMyOrders,
        fetchAdminOrders,
        fetchAdminUsers,
        updateOrderToDelivered,
        adminCreateProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
