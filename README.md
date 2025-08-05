# Kiosco Escolar - Sistema de Pedidos

## Descripción

Sistema de gestión de pedidos para kiosco escolar que permite a estudiantes de ciclo básico y superior realizar pedidos de manera digital.

## Funcionalidades para Estudiantes

### 🎓 Estudiantes (Ciclo Básico y Superior)

Los estudiantes pueden:

1. **Ver el Menú**: Explorar productos disponibles organizados por categorías
2. **Personalizar Productos**: Agregar ingredientes y condimentos a ensaladas
3. **Gestionar Carrito**: Agregar, modificar cantidad y eliminar productos
4. **Realizar Pedidos**: 
   - Seleccionar horario de retiro según su ciclo
   - Elegir método de pago (tarjeta, Mercado Pago, efectivo)
   - Confirmar pedido
5. **Seguir Pedidos**: Ver estado y detalles de pedidos realizados
6. **Descargar Comprobantes**: Generar PDF de confirmación

### Horarios de Retiro por Ciclo

- **Ciclo Básico**: 9:35, 11:55, 14:55
- **Ciclo Superior**: 9:35, 11:55, 14:55, 17:15, 19:35

## Cómo Probar la Funcionalidad de Estudiantes

### 1. Configuración Inicial

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con:
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Ejecutar el proyecto
npm run dev
```

### 2. Usuarios de Prueba

El sistema incluye usuarios demo para testing:

| Email | Contraseña | Rol | Descripción |
|-------|------------|-----|-------------|
| `usuario@ciclobasico.com` | `demo123` | Ciclo Básico | Estudiante ciclo básico |
| `usuario@ciclosuperior.com` | `demo123` | Ciclo Superior | Estudiante ciclo superior |
| `estudiante1@ciclobasico.com` | `demo123` | Ciclo Básico | Estudiante adicional |
| `estudiante2@ciclosuperior.com` | `demo123` | Ciclo Superior | Estudiante adicional |

### 3. Flujo de Pedido Completo

1. **Iniciar Sesión**: Usar credenciales de estudiante
2. **Explorar Menú**: Navegar por categorías y productos
3. **Agregar al Carrito**: 
   - Hacer clic en "Agregar al Carrito"
   - Para productos personalizables, seleccionar ingredientes
4. **Gestionar Carrito**: 
   - Ver carrito flotante (botón inferior derecho)
   - Modificar cantidades o eliminar productos
5. **Finalizar Pedido**:
   - Hacer clic en "Proceder al Pago"
   - Seleccionar horario de retiro
   - Elegir método de pago
   - Confirmar pedido
6. **Confirmación**: 
   - Ver página de confirmación con número de pedido
   - Descargar comprobante PDF
7. **Seguimiento**: 
   - Ir a "Mis Pedidos" para ver estado
   - Ver detalles completos del pedido

### 4. Características Especiales

#### Personalización de Ensaladas
- Seleccionar ingredientes específicos
- Agregar condimentos
- Ver precio actualizado en tiempo real

#### Gestión de Carrito
- Persistencia en localStorage
- Cálculo automático de totales
- Validación de stock

#### Seguimiento de Pedidos
- Estados: Pendiente, En Preparación, Listo, Entregado, Cancelado
- Historial completo de pedidos
- Filtros por estado y fecha

## Estructura de Base de Datos

### Tablas Principales

- **users**: Usuarios con roles (ciclo_basico, ciclo_superior, kiosquero, admin)
- **products**: Productos del menú con stock y personalización
- **orders**: Pedidos con estado y horario de retiro
- **order_items**: Items individuales de cada pedido
- **inventory_logs**: Registro de cambios de inventario
- **analytics_daily**: Análisis diario de ventas

### Políticas de Seguridad (RLS)

- Estudiantes solo pueden ver y crear sus propios pedidos
- Acceso restringido por rol de usuario
- Validación de permisos en cada operación

## Tecnologías Utilizadas

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Lucide Icons
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Sistema demo con roles
- **PDF**: jsPDF para comprobantes

## Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de producción
npm run lint         # Linting del código
```

### Estructura de Archivos

```
src/
├── components/
│   ├── student/     # Componentes para estudiantes
│   ├── kiosco/      # Componentes para kiosquero
│   ├── admin/       # Componentes para administrador
│   └── common/      # Componentes compartidos
├── contexts/        # Contextos de React
├── lib/            # Configuración de Supabase
├── types/          # Definiciones de TypeScript
└── utils/          # Utilidades (PDF, etc.)
```

## Notas Importantes

- El sistema está configurado para funcionar con Supabase
- Las políticas RLS están simplificadas para demo
- Los usuarios demo usan localStorage para persistencia de sesión
- En producción, implementar autenticación real de Supabase

## Soporte

Para problemas o preguntas sobre la funcionalidad de estudiantes, revisar:
1. Configuración de variables de entorno
2. Conexión a Supabase
3. Políticas RLS en la base de datos
4. Consola del navegador para errores 