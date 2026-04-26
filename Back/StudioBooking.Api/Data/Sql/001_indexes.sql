-- Indexes justified by typical user queries
-- idx_studio_city_id: used by /api/studios?cityId= filter
CREATE INDEX IF NOT EXISTS idx_studio_city_id ON studios(city_id);

-- idx_room_studio_id: used by /api/studios/:id to list rooms
CREATE INDEX IF NOT EXISTS idx_room_studio_id ON rooms(studio_id);

-- idx_booking_room_date: used for overlap check and /bookings list filtered by room+date
CREATE INDEX IF NOT EXISTS idx_booking_room_date ON bookings(room_id, date);

-- idx_booking_client_id: used by /api/bookings/mine for client's own bookings
CREATE INDEX IF NOT EXISTS idx_booking_client_id ON bookings(client_id);

-- idx_equipment_room_id: used by /api/rooms/:id to list equipment
CREATE INDEX IF NOT EXISTS idx_equipment_room_id ON equipment(room_id);
