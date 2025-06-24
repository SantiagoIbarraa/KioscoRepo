import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { Plus, Minus, Settings } from 'lucide-react';
import { SaladCustomizer } from './SaladCustomizer';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (customizations?: any) => {
    addToCart(product, quantity, customizations);
    addToast(`${product.name} agregado al carrito`, 'success');
    setQuantity(1);
    setShowCustomizer(false);
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full">
        <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">{product.name}</h3>
            <span className="text-lg font-bold text-primary-600 flex-shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
          
          {!product.available && (
            <div className="mb-4">
              <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                No disponible
              </span>
            </div>
          )}
          
          {/* This div will push the buttons to the bottom */}
          <div className="mt-auto">
            {product.available && (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium text-lg min-w-[2rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {product.customizable && (
                    <button
                      onClick={() => setShowCustomizer(true)}
                      className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm font-medium">Personalizar</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleAddToCart()}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium w-full"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCustomizer && product.customizable && (
        <SaladCustomizer
          product={product}
          quantity={quantity}
          onConfirm={handleAddToCart}
          onCancel={() => setShowCustomizer(false)}
        />
      )}
    </>
  );
};