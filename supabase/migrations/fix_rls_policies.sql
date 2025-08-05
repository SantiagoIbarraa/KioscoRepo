/*
  # Arreglar Políticas RLS para Desarrollo
  
  Este archivo simplifica las políticas RLS para permitir que la aplicación funcione
  correctamente tanto en modo demo como con usuarios autenticados de Supabase.
  
  IMPORTANTE: En producción, deberías implementar políticas más restrictivas.
*/

-- =====================================================
-- PASO 1: Limpiar políticas existentes
-- =====================================================

-- Productos
DROP POLICY IF EXISTS "Everyone can read available products" ON products;
DROP POLICY IF EXISTS "Kiosquero and admin can read all products" ON products;
DROP POLICY IF EXISTS "Kiosquero and admin can manage products" ON products;
DROP POLICY IF EXISTS "Kiosquero and admin can insert products" ON products;
DROP POLICY IF EXISTS "Allow read access to products" ON products;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON products;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON products;
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON products;
DROP POLICY IF EXISTS "Products full access" ON products;

-- Órdenes
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Kiosquero and admin can read all orders" ON orders;
DROP POLICY IF EXISTS "Kiosquero and admin can update orders" ON orders;
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
DROP POLICY IF EXISTS "Orders full access" ON orders;

-- Items de órdenes
DROP POLICY IF EXISTS "Users can read own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items for own orders" ON order_items;
DROP POLICY IF EXISTS "Kiosquero and admin can read all order items" ON order_items;
DROP POLICY IF EXISTS "Allow all operations on order_items" ON order_items;
DROP POLICY IF EXISTS "Order items full access" ON order_items;

-- Usuarios
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin and kiosquero can read all users" ON users;
DROP POLICY IF EXISTS "Admin can manage all users" ON users;

-- =====================================================
-- PASO 2: Crear políticas simplificadas para desarrollo
-- =====================================================

-- Usuarios: Políticas básicas
CREATE POLICY "users_select_own" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Permitir a admin y kiosquero ver todos los usuarios
CREATE POLICY "users_select_admin" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('admin', 'kiosquero')
    )
  );

-- Productos: Acceso completo para desarrollo
CREATE POLICY "products_select_all" ON products
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "products_insert_auth" ON products
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "products_update_auth" ON products
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "products_delete_auth" ON products
  FOR DELETE TO authenticated
  USING (true);

-- Órdenes: Políticas flexibles
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('admin', 'kiosquero')
    )
  );

CREATE POLICY "orders_insert_own" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('admin', 'kiosquero')
    )
  );

CREATE POLICY "orders_update_staff" ON orders
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('admin', 'kiosquero')
    )
  );

-- Items de órdenes: Políticas que siguen las de órdenes
CREATE POLICY "order_items_select_related" ON order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o 
      WHERE o.id = order_id 
      AND (
        o.user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM users u 
          WHERE u.id = auth.uid() 
          AND u.role IN ('admin', 'kiosquero')
        )
      )
    )
  );

CREATE POLICY "order_items_insert_related" ON order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o 
      WHERE o.id = order_id 
      AND (
        o.user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM users u 
          WHERE u.id = auth.uid() 
          AND u.role IN ('admin', 'kiosquero')
        )
      )
    )
  );

-- Logs de inventario: Solo staff
CREATE POLICY "inventory_logs_staff_all" ON inventory_logs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('admin', 'kiosquero')
    )
  );

-- Analytics: Solo staff
CREATE POLICY "analytics_staff_read" ON analytics_daily
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('admin', 'kiosquero')
    )
  );

-- =====================================================
-- PASO 3: Crear función helper para facilitar el desarrollo
-- =====================================================

-- Función para verificar si el usuario actual es staff
CREATE OR REPLACE FUNCTION is_staff()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'kiosquero')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si el usuario actual es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PASO 4: Crear usuarios de demo en Supabase Auth (opcional)
-- =====================================================

-- Nota: Estos INSERT solo funcionarán si ejecutas desde el dashboard de Supabase
-- o usando la service role key. Para desarrollo, puedes crear estos usuarios
-- manualmente desde el dashboard de Supabase Auth.

/*
Para crear usuarios de demo en Supabase Auth:

1. Ve al dashboard de Supabase > Authentication > Users
2. Crea los siguientes usuarios manualmente:

- usuario@ciclobasico.com (contraseña: demo123)
- usuario@ciclosuperior.com (contraseña: demo123)  
- usuario@kiosquero.com (contraseña: demo123)
- usuario@admin.com (contraseña: demo123)

3. Una vez creados, ejecuta este script para actualizar sus perfiles:
*/

-- Actualizar perfiles de usuarios existentes (si existen)
UPDATE users SET 
  name = 'Juan Pérez',
  role = 'ciclo_basico',
  phone = '+54 9 11 1234-5678',
  course = '3° Año'
WHERE email = 'usuario@ciclobasico.com';

UPDATE users SET 
  name = 'Ana García',
  role = 'ciclo_superior', 
  phone = '+54 9 11 2345-6789',
  course = '5° Año'
WHERE email = 'usuario@ciclosuperior.com';

UPDATE users SET 
  name = 'Pedro López',
  role = 'kiosquero',
  phone = '+54 9 11 3456-7890'
WHERE email = 'usuario@kiosquero.com';

UPDATE users SET 
  name = 'María Rodríguez',
  role = 'admin',
  phone = '+54 9 11 4567-8901'
WHERE email = 'usuario@admin.com';

-- =====================================================
-- PASO 5: Verificar configuración
-- =====================================================

-- Verificar que RLS esté habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'products', 'orders', 'order_items', 'inventory_logs', 'analytics_daily');

-- Verificar políticas activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'products', 'orders', 'order_items', 'inventory_logs', 'analytics_daily')
ORDER BY tablename, policyname;
