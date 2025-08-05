import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseAvailable, authenticateUser, signOut, getCurrentUser } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  role: 'ciclo_basico' | 'ciclo_superior' | 'kiosquero' | 'admin';
  name: string;
}

interface AuthContextData {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
  isSupabaseConnected: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const isDemoMode = !isSupabaseAvailable();

  // Usuarios de demostración (fallback)
  const demoUsers = [
    { 
      id: 'demo-1', 
      email: 'usuario@ciclobasico.com', 
      password: 'demo123', 
      role: 'ciclo_basico' as const, 
      name: 'Juan Pérez - Demo' 
    },
    { 
      id: 'demo-2', 
      email: 'usuario@ciclosuperior.com', 
      password: 'demo123', 
      role: 'ciclo_superior' as const, 
      name: 'Ana García - Demo' 
    },
    { 
      id: 'demo-3', 
      email: 'usuario@kiosquero.com', 
      password: 'demo123', 
      role: 'kiosquero' as const, 
      name: 'Pedro López - Demo' 
    },
    { 
      id: 'demo-4', 
      email: 'usuario@admin.com', 
      password: 'demo123', 
      role: 'admin' as const, 
      name: 'María Rodríguez - Demo' 
    }
  ];

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    console.log('Inicializando autenticación...');
    
    if (isDemoMode) {
      console.log('Modo demo activado');
      // Modo demo: usar localStorage
      const savedUser = localStorage.getItem('demo_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('Usuario demo cargado:', parsedUser.email);
        } catch (error) {
          console.error('Error parsing demo user:', error);
          localStorage.removeItem('demo_user');
        }
      }
      setLoading(false);
    } else if (supabase) {
      console.log('Verificando sesión de Supabase...');
      setIsSupabaseConnected(true);
      
      try {
        // Verificar sesión actual
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (session?.user) {
          console.log('Sesión activa encontrada:', session.user.email);
          await fetchUserProfile(session.user);
        } else {
          console.log('No hay sesión activa');
        }

        // Escuchar cambios en la autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            if (session?.user) {
              await fetchUserProfile(session.user);
            } else {
              setUser(null);
              setLoading(false);
            }
          }
        );

        setLoading(false);

        return () => {
          console.log('Limpiando suscripción de auth');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    } else {
      console.log('Supabase no disponible');
      setLoading(false);
    }
  };

  const fetchUserProfile = async (authUser: User) => {
    if (!supabase) return;

    try {
      console.log('Obteniendo perfil de usuario:', authUser.email);
      
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, name')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // Fallback: crear usuario básico con datos de auth
        const basicUser: AuthUser = {
          id: authUser.id,
          email: authUser.email || '',
          role: 'ciclo_basico', // rol por defecto
          name: authUser.email?.split('@')[0] || 'Usuario'
        };
        
        setUser(basicUser);
        return;
      }

      const userProfile: AuthUser = {
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name
      };

      console.log('Perfil de usuario cargado:', userProfile);
      setUser(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Intentando login para:', email);
    setLoading(true);

    try {
      if (isDemoMode) {
        console.log('Login en modo demo');
        // Autenticación demo
        const demoUser = demoUsers.find(u => u.email === email && u.password === password);
        if (demoUser) {
          const authUser = { 
            id: demoUser.id,
            email: demoUser.email,
            role: demoUser.role,
            name: demoUser.name
          };
          
          setUser(authUser);
          localStorage.setItem('demo_user', JSON.stringify(authUser));
          console.log('Login demo exitoso:', authUser.email);
          setLoading(false);
          return true;
        }
        
        console.log('Credenciales demo incorrectas');
        setLoading(false);
        return false;
      } else {
        console.log('Login con Supabase');
        // Autenticación Supabase
        const authResult = await authenticateUser(email, password);
        setLoading(false);
        
        if (authResult) {
          console.log('Login Supabase exitoso');
          return true;
        } else {
          console.log('Login Supabase fallido');
          return false;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    console.log('Cerrando sesión...');
    
    try {
      if (isDemoMode) {
        console.log('Logout en modo demo');
        localStorage.removeItem('demo_user');
        setUser(null);
      } else {
        console.log('Logout de Supabase');
        await signOut();
        // El estado se actualizará automáticamente a través del listener
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Función helper para verificar si el usuario tiene un rol específico
  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  // Función helper para verificar si el usuario es admin o kiosquero
  const isAdminOrKiosquero = (): boolean => {
    return hasRole(['admin', 'kiosquero']);
  };

  // Función helper para verificar si el usuario es estudiante
  const isStudent = (): boolean => {
    return hasRole(['ciclo_basico', 'ciclo_superior']);
  };

  const contextValue: AuthContextData = {
    user,
    loading,
    login,
    logout,
    isDemoMode,
    isSupabaseConnected,
    // Agregar funciones helper al contexto
    hasRole,
    isAdminOrKiosquero,
    isStudent,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para verificar permisos
export const usePermissions = () => {
  const { user, hasRole, isAdminOrKiosquero, isStudent } = useAuth();
  
  return {
    user,
    hasRole,
    isAdmin: user?.role === 'admin',
    isKiosquero: user?.role === 'kiosquero',
    isAdminOrKiosquero,
    isStudent,
    isCicloBasico: user?.role === 'ciclo_basico',
    isCicloSuperior: user?.role === 'ciclo_superior'
  };
};
