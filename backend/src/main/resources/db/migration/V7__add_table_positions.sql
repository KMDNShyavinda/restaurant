-- Migration V7: Add table floor plan coordinates (position_x, position_y) to tables table
ALTER TABLE tables ADD COLUMN IF NOT EXISTS position_x DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE tables ADD COLUMN IF NOT EXISTS position_y DOUBLE PRECISION DEFAULT 0.0;
