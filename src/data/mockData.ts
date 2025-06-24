import { Product, Order } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ensalada Mixta',
    category: 'ensaladas',
    price: 850,
    description: 'Lechuga, tomate, zanahoria, cebolla. Personalizable con tus ingredientes favoritos.',
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    customizable: true,
    ingredients: ['lechuga', 'tomate', 'zanahoria', 'cebolla', 'pepino', 'apio', 'remolacha']
  },
  {
    id: '2',
    name: 'Ensalada Caesar',
    category: 'ensaladas',
    price: 950,
    description: 'Lechuga romana, crutones, queso parmesano, aderezo caesar.',
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    customizable: true,
    ingredients: ['lechuga romana', 'crutones', 'queso parmesano', 'pollo']
  },
  {
    id: '3',
    name: 'Tostado de Jamón y Queso',
    category: 'tostados',
    price: 650,
    description: 'Pan tostado con jamón cocido y queso derretido.',
    image: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '4',
    name: 'Tostado Completo',
    category: 'tostados',
    price: 750,
    description: 'Jamón, queso, tomate, lechuga y mayonesa.',
    image: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '5',
    name: 'Sándwich de Milanesa',
    category: 'sandwiches',
    price: 1200,
    description: 'Milanesa de pollo, lechuga, tomate y mayonesa en pan árabe.',
    image: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '6',
    name: 'Agua Mineral',
    category: 'bebidas',
    price: 300,
    description: 'Agua mineral sin gas 500ml.',
    image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '7',
    name: 'Gaseosa Cola',
    category: 'bebidas',
    price: 400,
    description: 'Gaseosa cola 500ml.',
    image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '8',
    name: 'Jugo Natural de Naranja',
    category: 'bebidas',
    price: 500,
    description: 'Jugo de naranja exprimido fresco.',
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  }
];

export const BREAK_TIMES = {
  ciclo_basico: ['9:35', '11:55', '14:55'],
  ciclo_superior: ['9:35', '11:55', '14:55', '17:15', '19:35']
};

export const CONDIMENTS = ['sal', 'aceite', 'vinagre', 'limón', 'orégano', 'pimienta'];

// Mock orders data
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    items: [
      {
        product: PRODUCTS[0],
        quantity: 1,
        customizations: {
          ingredients: ['lechuga', 'tomate', 'zanahoria'],
          condiments: ['aceite', 'vinagre']
        }
      }
    ],
    totalAmount: 850,
    scheduledTime: '11:55',
    paymentMethod: 'tarjeta',
    status: 'pendiente',
    createdAt: new Date().toISOString(),
    userCycle: 'ciclo_basico'
  }
];