import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { TrendingUp, DollarSign, Package, Clock } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(allOrders);
  }, []);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  // Calculate metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Product sales analysis
  const productSales = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      const productName = item.product.name;
      if (!acc[productName]) {
        acc[productName] = { quantity: 0, revenue: 0 };
      }
      acc[productName].quantity += item.quantity;
      acc[productName].revenue += item.product.price * item.quantity;
    });
    return acc;
  }, {} as Record<string, { quantity: number; revenue: number }>);

  const topProducts = Object.entries(productSales)
    .sort(([,a], [,b]) => b.quantity - a.quantity)
    .slice(0, 5);

  // Time analysis
  const timeAnalysis = orders.reduce((acc, order) => {
    const time = order.scheduledTime;
    if (!acc[time]) {
      acc[time] = { orders: 0, revenue: 0 };
    }
    acc[time].orders += 1;
    acc[time].revenue += order.totalAmount;
    return acc;
  }, {} as Record<string, { orders: number; revenue: number }>);

  const MetricCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 ${color} rounded-lg`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ml-64 min-h-screen bg-cream-50">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Análisis de ventas y rendimiento del kiosco</p>
        </div>

        {/* Period Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Período:</span>
            <div className="flex space-x-2">
              {['day', 'week', 'month'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period === 'day' ? 'Hoy' : period === 'week' ? 'Semana' : 'Mes'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total de Pedidos"
            value={totalOrders.toString()}
            icon={<Package className="h-6 w-6 text-white" />}
            color="bg-blue-600"
          />
          <MetricCard
            title="Ingresos Totales"
            value={formatPrice(totalRevenue)}
            icon={<DollarSign className="h-6 w-6 text-white" />}
            color="bg-green-600"
          />
          <MetricCard
            title="Valor Promedio"
            value={formatPrice(averageOrderValue)}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            color="bg-purple-600"
          />
          <MetricCard
            title="Pedidos Activos"
            value={orders.filter(o => ['pendiente', 'en_preparacion', 'listo'].includes(o.status)).length.toString()}
            icon={<Clock className="h-6 w-6 text-white" />}
            color="bg-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Más Vendidos</h3>
            <div className="space-y-4">
              {topProducts.map(([productName, data], index) => (
                <div key={productName} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{productName}</p>
                      <p className="text-sm text-gray-600">{data.quantity} unidades</p>
                    </div>
                  </div>
                  <span className="font-medium text-primary-600">
                    {formatPrice(data.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Horario</h3>
            <div className="space-y-4">
              {Object.entries(timeAnalysis)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([time, data]) => (
                <div key={time} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex items-center justify-center w-12 h-8 bg-blue-100 text-blue-600 rounded text-sm font-medium mr-3">
                      {time}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{data.orders} pedidos</p>
                    </div>
                  </div>
                  <span className="font-medium text-blue-600">
                    {formatPrice(data.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ventas</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Gráfico de tendencias (implementación futura)</p>
          </div>
        </div>
      </div>
    </div>
  );
};