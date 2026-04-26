-- Trigger 2: Auto-calculate Booking.total_price on insert/update.
-- Formula: duration_hours × room.price_per_hour + SUM(be.price_snapshot) × duration_hours
CREATE OR REPLACE FUNCTION fn_booking_calc_total_price()
RETURNS TRIGGER AS $$
DECLARE
    v_room_price   DECIMAL(10,2);
    v_equip_price  DECIMAL(10,2);
    v_duration_hrs DECIMAL(10,4);
BEGIN
    SELECT price_per_hour INTO v_room_price FROM rooms WHERE room_id = NEW.room_id;

    v_duration_hrs := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 3600.0;

    SELECT COALESCE(SUM(price_snapshot), 0) INTO v_equip_price
    FROM booking_equipment WHERE booking_id = NEW.booking_id;

    NEW.total_price := ROUND((v_room_price + v_equip_price) * v_duration_hrs, 2);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_booking_calc_total_price ON bookings;
CREATE TRIGGER trg_booking_calc_total_price
    BEFORE INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION fn_booking_calc_total_price();
