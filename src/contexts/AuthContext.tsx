import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types'

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'usuario@ciclobasico.com',
    password: 'demo123',
    role: 'ciclo_basico',
    name: 'Estudiante Ciclo Básico'
  },
  {
    id: '2',
    email: 'usuario@ciclosuperior.com',
    password: 'demo123',
    role: 'ciclo_superior',
    name: 'Estudiante Ciclo Superior'
  },
  {
    id: '3',
    email: 'usuario@kiosquero.com',
    password: 'demo123',
    role: 'kiosquero',
    name: 'Encargado del Kiosco'
  },
  {
    id: '4',
    email: 'usuario@admin.com',
    password: 'demo123',
    role: 'admin',
    name: 'Administrador'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      // Configurar una sesion simple para Supabase RLS
      setupSupabaseSession(userData)
    }
    setIsLoading(false)
  }, []);

  const setupSupabaseSession = async (userData: User) => {
    try {
      // Crear un token de sesion simple para propositos de demostracion
      // En produccion, esto seria manejado por la autenticacion de Supabase
      const sessionToken = btoa(JSON.stringify({ 
        user_id: userData.id, 
        role: userData.role,
        email: userData.email 
      }))
      
      // Almacenar informacion de sesion que puede ser usada por las politicas RLS
      localStorage.setItem('supabase_session', sessionToken)
    } catch (error) {
      console.error('Error al configurar la sesion:', error)
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simular retraso de llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password)
    
    if (demoUser) {
      const { password: _, ...userWithoutPassword } = demoUser
      setUser(userWithoutPassword)
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
      await setupSupabaseSession(userWithoutPassword)
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  };

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('supabase_session')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
};