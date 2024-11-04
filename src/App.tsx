import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { SellerDashboard } from './components/SellerDashboard';
import { ProductForm } from './components/ProductForm';
import { AuthModal } from './components/AuthModal';
import { Product, CartItem, User, ProductFormData } from './types';
import { fetchProducts, createProduct } from './api';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (err) {
          console.error('Error parsing user data:', err);
          localStorage.removeItem('user');
        }
      }
    };

    loadUser();
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error loading products:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsDashboardOpen(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCartItems(items => {
      const existingItem = items.find(item => item._id === product._id);
      if (existingItem) {
        return items.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items
        .map(item =>
          item._id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const handleAddProduct = async (formData: ProductFormData) => {
    if (!currentUser) return;

    try {
      setError(null);
      await createProduct(formData, currentUser._id, currentUser.name);
      await loadProducts();
      setIsProductFormOpen(false);
    } catch (err) {
      setError('Failed to add product. Please try again.');
      console.error('Error adding product:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onSellerDashboardClick={() => setIsDashboardOpen(true)}
        currentUser={currentUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </main>

      {isCartOpen && (
        <Cart
          items={cartItems}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateQuantity}
        />
      )}

      {isDashboardOpen && currentUser?.isSeller && (
        <SellerDashboard
          products={products.filter(p => p.sellerId === currentUser._id)}
          onAddProduct={() => setIsProductFormOpen(true)}
          onClose={() => setIsDashboardOpen(false)}
        />
      )}

      {isProductFormOpen && (
        <ProductForm
          onSubmit={handleAddProduct}
          onClose={() => setIsProductFormOpen(false)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuth={setCurrentUser}
        />
      )}
    </div>
  );
}

export default App;