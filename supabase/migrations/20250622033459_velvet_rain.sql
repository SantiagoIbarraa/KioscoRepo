/*
  # Add INSERT policy for products table

  1. Security Changes
    - Add explicit INSERT policy for kiosquero and admin users to create products
    - This resolves the RLS violation when adding new products through the inventory management interface

  The existing "Kiosquero and admin can manage products" policy with ALL command should cover this,
  but we're adding an explicit INSERT policy to ensure proper permissions.
*/

-- Add explicit INSERT policy for products
CREATE POLICY "Kiosquero and admin can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM users
      WHERE users.id = auth.uid() 
      AND users.role = ANY (ARRAY['kiosquero'::user_role, 'admin'::user_role])
    )
  );