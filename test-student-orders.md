# Test Guide: Funcionalidad de Pedidos para Estudiantes

## Objetivo
Verificar que los estudiantes de ciclo básico y superior pueden realizar pedidos correctamente en el sistema.

## Prerrequisitos
1. Base de datos Supabase configurada y accesible
2. Variables de entorno configuradas:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Proyecto ejecutándose (`npm run dev`)

## Casos de Prueba

### 1. Autenticación de Estudiantes

**Objetivo**: Verificar que los estudiantes pueden iniciar sesión

**Pasos**:
1. Abrir la aplicación en el navegador
2. Usar credenciales de estudiante:
   - Email: `usuario@ciclobasico.com`
   - Contraseña: `demo123`
3. Verificar que se redirige al menú

**Resultado Esperado**: 
- ✅ Login exitoso
- ✅ Redirección a `/menu`
- ✅ Navegación de estudiante visible

### 2. Visualización del Menú

**Objetivo**: Verificar que los estudiantes pueden ver productos disponibles

**Pasos**:
1. Navegar al menú
2. Verificar que se muestran productos
3. Probar filtros por categoría
4. Probar búsqueda de productos

**Resultado Esperado**:
- ✅ Productos cargan correctamente
- ✅ Filtros funcionan
- ✅ Búsqueda funciona
- ✅ Imágenes de productos se muestran

### 3. Agregar Productos al Carrito

**Objetivo**: Verificar funcionalidad del carrito

**Pasos**:
1. Hacer clic en "Agregar al Carrito" en un producto
2. Verificar que aparece en el carrito flotante
3. Agregar productos personalizables (ensaladas)
4. Modificar cantidades
5. Eliminar productos

**Resultado Esperado**:
- ✅ Productos se agregan al carrito
- ✅ Contador del carrito se actualiza
- ✅ Personalización funciona para ensaladas
- ✅ Modificación de cantidades funciona
- ✅ Eliminación funciona

### 4. Proceso de Checkout

**Objetivo**: Verificar que se puede completar un pedido

**Pasos**:
1. Tener productos en el carrito
2. Hacer clic en "Proceder al Pago"
3. Seleccionar horario de retiro
4. Elegir método de pago
5. Confirmar pedido

**Resultado Esperado**:
- ✅ Página de checkout se carga
- ✅ Horarios disponibles según ciclo del estudiante
- ✅ Métodos de pago funcionan
- ✅ Confirmación exitosa

### 5. Creación de Pedido en Base de Datos

**Objetivo**: Verificar que el pedido se guarda en Supabase

**Pasos**:
1. Completar un pedido
2. Verificar en Supabase:
   - Tabla `orders` tiene el nuevo registro
   - Tabla `order_items` tiene los items
   - `user_id` coincide con el estudiante
   - `status` es 'pendiente'

**Resultado Esperado**:
- ✅ Pedido creado en `orders`
- ✅ Items creados en `order_items`
- ✅ Datos correctos (usuario, total, horario, etc.)
- ✅ ID de pedido generado automáticamente

### 6. Confirmación de Pedido

**Objetivo**: Verificar página de confirmación

**Pasos**:
1. Después de confirmar pedido
2. Verificar página de confirmación
3. Descargar comprobante PDF
4. Verificar número de pedido

**Resultado Esperado**:
- ✅ Página de confirmación se muestra
- ✅ Número de pedido visible
- ✅ Detalles del pedido correctos
- ✅ PDF se descarga correctamente

### 7. Seguimiento de Pedidos

**Objetivo**: Verificar que se pueden ver pedidos realizados

**Pasos**:
1. Ir a "Mis Pedidos"
2. Verificar que aparece el pedido reciente
3. Hacer clic en un pedido para ver detalles
4. Verificar información completa

**Resultado Esperado**:
- ✅ Lista de pedidos se carga
- ✅ Pedido reciente aparece
- ✅ Detalles completos se muestran
- ✅ Estados correctos

### 8. Diferentes Ciclos Escolares

**Objetivo**: Verificar horarios específicos por ciclo

**Pasos**:
1. Probar con usuario ciclo básico
2. Probar con usuario ciclo superior
3. Verificar horarios disponibles

**Resultado Esperado**:
- ✅ Ciclo básico: 9:35, 11:55, 14:55
- ✅ Ciclo superior: 9:35, 11:55, 14:55, 17:15, 19:35

## Verificación en Base de Datos

### Consultas SQL para Verificar

```sql
-- Verificar pedidos del estudiante
SELECT * FROM orders 
WHERE user_id = 'ID_DEL_ESTUDIANTE' 
ORDER BY created_at DESC;

-- Verificar items del pedido
SELECT oi.*, p.name 
FROM order_items oi 
JOIN products p ON oi.product_id = p.id 
WHERE oi.order_id = 'ORD-XXX';

-- Verificar que el estudiante existe
SELECT * FROM users 
WHERE email = 'usuario@ciclobasico.com';
```

## Errores Comunes y Soluciones

### 1. Error de Conexión a Supabase
**Síntoma**: Error en consola sobre variables de entorno
**Solución**: Verificar `.env.local` con credenciales correctas

### 2. Error de RLS (Row Level Security)
**Síntoma**: Error 403 al crear pedidos
**Solución**: Verificar políticas RLS en Supabase

### 3. Error de Autenticación
**Síntoma**: No se puede crear pedido
**Solución**: Verificar que el usuario está autenticado correctamente

### 4. Error de Generación de ID
**Síntoma**: Error al generar ID de pedido
**Solución**: Verificar función `generate_order_id()` en Supabase

## Métricas de Éxito

- ✅ 100% de pedidos se crean exitosamente
- ✅ 100% de confirmaciones se muestran
- ✅ 100% de seguimientos funcionan
- ✅ 0 errores en consola del navegador
- ✅ 0 errores en logs de Supabase

## Reporte de Pruebas

Completar después de ejecutar todas las pruebas:

```
Fecha: _______________
Tester: _______________

✅ Autenticación: _____
✅ Menú: _____
✅ Carrito: _____
✅ Checkout: _____
✅ Base de Datos: _____
✅ Confirmación: _____
✅ Seguimiento: _____
✅ Ciclos: _____

Errores encontrados:
- ________________
- ________________

Observaciones:
- ________________
- ________________
``` 