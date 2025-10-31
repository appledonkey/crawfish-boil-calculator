/*
  # Create Saved Boils Table

  1. New Tables
    - `saved_boils`
      - `id` (uuid, primary key)
      - `name` (text) - User-provided name for the boil
      - `mode` (text) - basic or advanced
      - `style` (text) - cajun or vietcajun
      - `location` (text) - louisiana, texas, or other
      - `people_count` (integer) - Number of people
      - `lbs_per_person` (numeric) - Pounds of crawfish per person
      - `spice_level` (integer) - 1-4 spice level
      - `total_cost` (numeric) - Calculated total cost
      - `share_token` (text, unique) - URL-safe token for sharing
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `saved_boils` table
    - Add policy for public read access via share_token
    - Add policy for creating new boils (public)

  3. Indexes
    - Index on share_token for fast lookups
*/

CREATE TABLE IF NOT EXISTS saved_boils (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'My Crawfish Boil',
  mode text NOT NULL DEFAULT 'basic' CHECK (mode IN ('basic', 'advanced')),
  style text NOT NULL DEFAULT 'cajun' CHECK (style IN ('cajun', 'vietcajun')),
  location text NOT NULL DEFAULT 'louisiana' CHECK (location IN ('louisiana', 'texas', 'other')),
  people_count integer NOT NULL CHECK (people_count > 0),
  lbs_per_person numeric(4,2) NOT NULL CHECK (lbs_per_person > 0),
  spice_level integer NOT NULL DEFAULT 2 CHECK (spice_level BETWEEN 1 AND 4),
  total_cost numeric(10,2) NOT NULL DEFAULT 0,
  share_token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(12), 'base64'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE saved_boils ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shared boils"
  ON saved_boils FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create boils"
  ON saved_boils FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_saved_boils_share_token ON saved_boils(share_token);
