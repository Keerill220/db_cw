-- Trigger 3: Auto-set BookingEquipment.price_snapshot from Equipment.price_per_hour on insert.
-- Ensures the snapshot reflects the price at time of booking, not future edits.
CREATE OR REPLACE FUNCTION fn_be_price_snapshot()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.price_snapshot IS NULL OR NEW.price_snapshot = 0 THEN
        SELECT price_per_hour INTO NEW.price_snapshot
        FROM equipment WHERE equipment_id = NEW.equipment_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_be_price_snapshot ON booking_equipment;
CREATE TRIGGER trg_be_price_snapshot
    BEFORE INSERT ON booking_equipment
    FOR EACH ROW EXECUTE FUNCTION fn_be_price_snapshot();
