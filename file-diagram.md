# Diagrama de Archivos - KioscoRepo

```
KioscoRepo/
├── 📄 package.json                    # Configuración del proyecto y dependencias
├── 📄 package-lock.json              # Lock file de dependencias
├── 📄 index.html                     # Página principal HTML
├── 📄 README.md                      # Documentación del proyecto
├── 📄 tsconfig.json                  # Configuración TypeScript
├── 📄 tsconfig.app.json              # Configuración TypeScript para la app
├── 📄 tsconfig.node.json             # Configuración TypeScript para Node
├── 📄 vite.config.ts                 # Configuración de Vite
├── 📄 tailwind.config.js             # Configuración de Tailwind CSS
├── 📄 postcss.config.js              # Configuración de PostCSS
├── 📄 eslint.config.js               # Configuración de ESLint
├── 📄 test-student-orders.md         # Documentación de pruebas
│
├── 📁 src/                           # Código fuente principal
│   ├── 📄 main.tsx                   # Punto de entrada de la aplicación
│   ├── 📄 App.tsx                    # Componente principal de la app
│   ├── 📄 index.css                  # Estilos globales
│   ├── 📄 vite-env.d.ts              # Tipos de Vite
│   │
│   ├── 📁 types/                     # Definiciones de tipos TypeScript
│   │   └── 📄 index.ts               # Tipos principales de la aplicación
│   │
│   ├── 📁 lib/                       # Utilidades y configuración
│   │   ├── 📄 supabase.ts            # Configuración de Supabase
│   │   └── 📄 database.types.ts      # Tipos de la base de datos
│   │
│   ├── 📁 utils/                     # Utilidades generales
│   │   └── 📄 pdfGenerator.ts        # Generador de PDFs
│   │
│   ├── 📁 data/                      # Datos mock y estáticos
│   │   └── 📄 mockData.ts            # Datos de prueba
│   │
│   ├── 📁 contexts/                  # Contextos de React
│   │   ├── 📄 AuthContext.tsx        # Contexto de autenticación
│   │   ├── 📄 CartContext.tsx        # Contexto del carrito de compras
│   │   └── 📄 ToastContext.tsx       # Contexto de notificaciones
│   │
│   └── 📁 components/                # Componentes de React
│       ├── 📁 common/                # Componentes comunes
│       │   ├── 📄 LoadingSpinner.tsx # Spinner de carga
│       │   └── 📄 Toast.tsx          # Componente de notificaciones
│       │
│       ├── 📁 layout/                # Componentes de layout
│       │   └── 📄 Navigation.tsx     # Navegación principal
│       │
│       ├── 📁 auth/                  # Componentes de autenticación
│       │   └── 📄 LoginForm.tsx      # Formulario de login
│       │
│       ├── 📁 admin/                 # Componentes de administración
│       │   └── 📄 UsersPage.tsx      # Página de gestión de usuarios
│       │
│       ├── 📁 kiosco/                # Componentes del kiosco
│       │   ├── 📄 KioscoDashboard.tsx # Panel principal del kiosco
│       │   ├── 📄 InventoryPage.tsx  # Página de inventario
│       │   └── 📄 AnalyticsPage.tsx  # Página de análisis
│       │
│       └── 📁 student/               # Componentes para estudiantes
│           ├── 📄 MenuPage.tsx       # Página del menú
│           ├── 📄 ProductCard.tsx    # Tarjeta de producto
│           ├── 📄 CartSidebar.tsx    # Sidebar del carrito
│           ├── 📄 CheckoutPage.tsx   # Página de checkout
│           ├── 📄 OrdersPage.tsx     # Página de órdenes
│           ├── 📄 ProfilePage.tsx    # Página de perfil
│           ├── 📄 SaladCustomizer.tsx # Personalizador de ensaladas
│           ├── 📄 OrderConfirmationPage.tsx # Confirmación de orden
│           └── 📄 ExpandableNavigation.tsx # Navegación expandible
│
├── 📁 supabase/                      # Configuración de Supabase
│   └── 📁 migrations/                # Migraciones de la base de datos
│       ├── 📄 20250619001738_turquoise_tree.sql
│       ├── 📄 20250622033459_velvet_rain.sql
│       └── 📄 20250622033916_billowing_lagoon.sql
│
└── 📁 usuario/                       # Archivos de usuario (posiblemente legacy)
    ├── 📄 index.html                 # HTML de usuario
    └── 📄 style.css                  # Estilos de usuario
```

## Descripción de la Estructura

### 📁 **src/** - Código Fuente Principal
- **main.tsx**: Punto de entrada de la aplicación React
- **App.tsx**: Componente raíz que maneja el routing y la estructura general
- **index.css**: Estilos globales y configuración de Tailwind CSS

### 📁 **src/types/** - Tipos TypeScript
- **index.ts**: Definiciones de tipos principales como `Order`, `Product`, `User`, etc.

### 📁 **src/lib/** - Configuración y Utilidades
- **supabase.ts**: Configuración del cliente de Supabase
- **database.types.ts**: Tipos generados automáticamente de la base de datos

### 📁 **src/contexts/** - Contextos de React
- **AuthContext.tsx**: Manejo de autenticación y estado del usuario
- **CartContext.tsx**: Gestión del carrito de compras
- **ToastContext.tsx**: Sistema de notificaciones

### 📁 **src/components/** - Componentes de React

#### 📁 **common/** - Componentes Reutilizables
- **LoadingSpinner.tsx**: Spinner de carga
- **Toast.tsx**: Componente de notificaciones

#### 📁 **layout/** - Componentes de Layout
- **Navigation.tsx**: Navegación principal de la aplicación

#### 📁 **auth/** - Autenticación
- **LoginForm.tsx**: Formulario de inicio de sesión

#### 📁 **admin/** - Panel de Administración
- **UsersPage.tsx**: Gestión de usuarios del sistema

#### 📁 **kiosco/** - Panel del Kiosco
- **KioscoDashboard.tsx**: Panel principal para gestionar órdenes
- **InventoryPage.tsx**: Gestión de inventario
- **AnalyticsPage.tsx**: Análisis y reportes

#### 📁 **student/** - Interfaz de Estudiante
- **MenuPage.tsx**: Página principal del menú
- **ProductCard.tsx**: Tarjeta individual de producto
- **CartSidebar.tsx**: Sidebar del carrito de compras
- **CheckoutPage.tsx**: Proceso de checkout
- **OrdersPage.tsx**: Historial de órdenes
- **ProfilePage.tsx**: Perfil del usuario
- **SaladCustomizer.tsx**: Personalizador de ensaladas
- **OrderConfirmationPage.tsx**: Confirmación de orden
- **ExpandableNavigation.tsx**: Navegación expandible

### 📁 **supabase/** - Base de Datos
- **migrations/**: Archivos SQL de migración de la base de datos

### 📁 **usuario/** - Archivos Legacy
- Posiblemente archivos de una versión anterior o separada del sistema

## Tecnologías Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Icons**: Lucide React
- **Linting**: ESLint
- **Build Tool**: Vite

## Flujo de Datos

1. **Autenticación** → AuthContext
2. **Navegación** → Navigation.tsx
3. **Productos** → MenuPage.tsx + ProductCard.tsx
4. **Carrito** → CartContext + CartSidebar.tsx
5. **Checkout** → CheckoutPage.tsx
6. **Órdenes** → KioscoDashboard.tsx (admin) + OrdersPage.tsx (student)
7. **Notificaciones** → ToastContext + Toast.tsx 