import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { CartSidebar } from './CartSidebar';
import { ExpandableNavigation } from './ExpandableNavigation';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase, isSupabaseAvailable } from '../../lib/supabase';
import { PRODUCTS } from '../../data/mockData';
import { ShoppingCart, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
  is_available: boolean;
  is_customizable: boolean;
  ingredients: string[] | null;
}

export const MenuPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { addToast } = useToast();

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'ensaladas', name: 'Ensaladas' },
    { id: 'tostados', name: 'Tostados' },
    { id: 'sandwiches', name: 'Sándwiches' },
    { id: 'bebidas', name: 'Bebidas' },
    { id: 'empanadas', name: 'Empanadas' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      if (isSupabaseAvailable() && supabase) {
        console.log('Intentando cargar productos desde Supabase...');
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_available', true)
          .order('name');

        if (error) {
          console.error('Error de Supabase:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log(`Productos cargados desde Supabase: ${data.length}`);
          setProducts(data);
        } else {
          console.log('No se encontraron productos en Supabase, usando datos de demostración');
          // Convert mock data to database format
          const mockProducts = PRODUCTS.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description,
            image_url: product.image,
            is_available: product.available,
            is_customizable: product.customizable || false,
            ingredients: product.ingredients || null
          }));
          setProducts(mockProducts);
        }
      } else {
        console.log('Supabase no disponible, usando datos de demostración');
        // Convert mock data to database format
        const mockProducts = PRODUCTS.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          image_url: product.image,
          is_available: product.available,
          is_customizable: product.customizable || false,
          ingredients: product.ingredients || null
        }));
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      addToast('Error al cargar productos, usando datos de demostración', 'info');
      
      // Fallback to mock data
      const mockProducts = PRODUCTS.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        image_url: product.image,
        is_available: product.available,
        is_customizable: product.customizable || false,
        ingredients: product.ingredients || null
      }));
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Convert database product to component format
  const convertProduct = (dbProduct: Product) => ({
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    price: dbProduct.price,
    description: dbProduct.description || '',
    image: dbProduct.image_url || 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: dbProduct.is_available,
    customizable: dbProduct.is_customizable,
    ingredients: dbProduct.ingredients || []
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pl-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pl-16">
      {/* Expandable Navigation */}
      <ExpandableNavigation />

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full hover:bg-primary-700 transition-colors shadow-lg z-30"
      >
        <ShoppingCart className="h-6 w-6" />
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
            {getTotalItems()}
          </span>
        )}
      </button>

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Menú del Kiosco</h1>
            {!isSupabaseAvailable() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Modo Demostración:</strong> Mostrando productos de ejemplo. 
                  Configura las variables de entorno de Supabase para conectar a la base de datos.
                </p>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={convertProduct(product)} />
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        )}
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};