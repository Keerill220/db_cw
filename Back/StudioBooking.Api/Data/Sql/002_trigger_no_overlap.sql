-- Trigger 1: Prevent overlapping bookings for the same room on the same date.
-- Guards against double-booking regardless of application-layer checks.
CREATE OR REPLACE FUNCTION fn_booking_no_overlap()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM bookings
        WHERE room_id = NEW.room_id
          AND date = NEW.date
          AND booking_id <> COALESCE(NEW.booking_id, -1)
          AND status IN ('Pending', 'Confirmed')
          AND start_time < NEW.end_time
          AND end_time > NEW.start_time
    ) THEN
        RAISE EXCEPTION 'Room % is already booked on % from % to %',
            NEW.room_id, NEW.date, NEW.start_time, NEW.end_time;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_booking_no_overlap ON bookings;
CREATE TRIGGER trg_booking_no_overlap
    BEFORE INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION fn_booking_no_overlap();
