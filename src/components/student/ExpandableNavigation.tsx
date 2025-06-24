import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Clock, User, ChevronRight, ChevronLeft, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const ExpandableNavigation: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || (user.role !== 'ciclo_basico' && user.role !== 'ciclo_superior')) {
    return null;
  }

  const navItems = [
    { icon: Home, label: 'Inicio', path: '/menu' },
    { icon: Clock, label: 'Pedidos', path: '/orders' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    setIsExpanded(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Navigation */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-primary-600 text-white p-2 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          {isExpanded ? (
            <div>
              <h2 className="text-lg font-bold text-primary-700">Kiosco Escolar</h2>
              <p className="text-sm text-gray-600 mt-1">{user.name}</p>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 flex-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                location.pathname === path
                  ? 'text-primary-600 bg-primary-50 border-r-2 border-primary-600'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
              }`}
              onClick={() => setIsExpanded(false)}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isExpanded && <span className="ml-3">{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-0 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="ml-3">Cerrar Sesión</span>}
          </button>
        </div>

        {/* User Info at Bottom (when expanded) */}
        {isExpanded && (
          <div className="absolute bottom-16 left-4 right-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Conectado como:</p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};