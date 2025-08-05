import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle, CheckCircle, Coffee } from 'lucide-react';
import { initializeApp } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'demo' | 'error'>('checking');
  
  const { login, isDemoMode, isSupabaseConnected } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Credenciales de demostración
  const demoCredentials = [
    { 
      email: 'usuario@ciclobasico.com', 
      password: 'demo123', 
      role: 'Estudiante Ciclo Básico',
      description: 'Acceso al menú y realización de pedidos'
    },
    { 
      email: 'usuario@ciclosuperior.com', 
      password: 'demo123', 
      role: 'Estudiante Ciclo Superior',
      description: 'Acceso al menú y realización de pedidos'
    },
    { 
      email: 'usuario@kiosquero.com', 
      password: 'demo123', 
      role: 'Kiosquero',
      description: 'Gestión de pedidos e inventario'
    },
    { 
      email: 'usuario@admin.com', 
      password: 'demo123', 
      role: 'Administrador',
      description: 'Acceso completo al sistema'
    }
  ];

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    
    if (isDemoMode) {
      setConnectionStatus('demo');
    } else {
      try {
        const connected = await initializeApp();
        setConnectionStatus(connected ? 'connected' : 'error');
      } catch (error) {
        console.error('Error checking connection:', error);
        setConnectionStatus('error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        // Redirigir a la página solicitada o al dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError('Email o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const getConnectionStatusMessage = () => {
    switch (connectionStatus) {
      case 'checking':
        return {
          color: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />,
          message: 'Verificando conexión...'
        };
      case 'connected':
        return {
          color: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="h-4 w-4" />,
          message: 'Conectado a Supabase'
        };
      case 'demo':
        return {
          color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: <AlertCircle className="h-4 w-4" />,
          message: 'Modo Demostración - Supabase no configurado'
        };
      case 'error':
        return {
          color: 'bg-red-50 border-red-200 text-red-800',
          icon: <AlertCircle className="h-4 w-4" />,
          message: 'Error de conexión - Usando modo demostración'
        };
      default:
        return null;
    }
  };

  const statusInfo = getConnectionStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Coffee className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kiosco Escolar</h1>
          <p className="text-gray-600">Sistema de Gestión y Pedidos</p>
        </div>

        {/* Connection Status */}
        {statusInfo && (
          <div className={`border rounded-lg p-3 mb-6 flex items-center ${statusInfo.color}`}>
            {statusInfo.icon}
            <span className="ml-2 text-sm font-medium">{statusInfo.message}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="usuario@ejemplo.com"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="h-4 w-4 inline mr-2" />
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || connectionStatus === 'checking'}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Iniciando sesión...
              </div>
            ) : (
              <>
                <LogIn className="h-4 w-4 inline mr-2" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        {(isDemoMode || connectionStatus === 'demo' || connectionStatus === 'error') && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <Coffee className="h-4 w-4 mr-2" />
              Cuentas de Demostración
            </h3>
            <div className="space-y-3">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(cred.email, cred.password)}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary-200 transition-colors disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                        {cred.role}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{cred.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{cred.email}</div>
                    </div>
                    <LogIn className="h-4 w-4 text-gray-400 group-hover:text-primary-500" />
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Contraseña para todas las cuentas: <code className="bg-gray-100 px-1 rounded">demo123</code>
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {connectionStatus === 'demo' && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Para conectar con Supabase:
            </h4>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Crea un archivo <code>.env</code> en la raíz del proyecto</li>
              <li>Agrega tus credenciales de Supabase</li>
              <li>Configura <code>VITE_DEMO_MODE=false</code></li>
              <li>Reinicia el servidor de desarrollo</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
