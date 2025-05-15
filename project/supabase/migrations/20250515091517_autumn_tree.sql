/*
  # Initial Schema Setup

  1. New Tables
    - `stocks`
      - `id` (uuid, primary key)
      - `ticker` (text, unique)
      - `name` (text)
      - `quantity` (integer)
      - `purchase_price` (decimal)
      - `purchase_date` (date)
      - `current_price` (decimal)
      - `last_updated` (timestamptz)
      - `created_at` (timestamptz)

    - `members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamptz)

    - `payments`
      - `id` (uuid, primary key)
      - `member_id` (uuid, foreign key)
      - `amount` (decimal)
      - `payment_date` (date)
      - `status` (text)
      - `created_at` (timestamptz)

    - `notes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `tags` (text[])
      - `created_at` (timestamptz)

    - `alerts`
      - `id` (uuid, primary key)
      - `ticker` (text)
      - `type` (text)
      - `message` (text)
      - `priority` (text)
      - `read` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE IF NOT EXISTS stocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker text UNIQUE NOT NULL,
  name text NOT NULL,
  quantity integer NOT NULL,
  purchase_price decimal NOT NULL,
  purchase_date date NOT NULL,
  current_price decimal NOT NULL,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  amount decimal NOT NULL,
  payment_date date,
  status text NOT NULL CHECK (status IN ('paid', 'pending', 'late')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  tags text[],
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker text NOT NULL,
  type text NOT NULL CHECK (type IN ('price-change', 'suggestion')),
  message text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON stocks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON stocks
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON members
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON members
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON payments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON payments
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON notes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON notes
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON alerts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON alerts
  FOR ALL TO authenticated USING (true);