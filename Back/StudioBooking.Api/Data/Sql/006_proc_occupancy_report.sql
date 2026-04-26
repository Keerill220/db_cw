-- Stored Procedure 5: Studio occupancy report for last N months.
-- Returns per-studio, per-month booking count and occupied hours.
CREATE OR REPLACE FUNCTION sp_studio_occupancy_report(p_months INT DEFAULT 7)
RETURNS TABLE (
    studio_id    INT,
    studio_name  TEXT,
    report_year  INT,
    report_month INT,
    total_bookings INT,
    occupied_hours DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.studio_id,
        s.name::TEXT,
        EXTRACT(YEAR  FROM b.date::DATE)::INT  AS report_year,
        EXTRACT(MONTH FROM b.date::DATE)::INT  AS report_month,
        COUNT(b.booking_id)::INT               AS total_bookings,
        ROUND(SUM(
            EXTRACT(EPOCH FROM (b.end_time - b.start_time)) / 3600.0
        )::NUMERIC, 2)                         AS occupied_hours
    FROM bookings b
    JOIN rooms r ON r.room_id = b.room_id
    JOIN studios s ON s.studio_id = r.studio_id
    WHERE b.date >= (CURRENT_DATE - (p_months || ' months')::INTERVAL)::DATE
      AND b.status IN ('Confirmed', 'Completed')
    GROUP BY s.studio_id, s.name, report_year, report_month
    ORDER BY s.studio_id, report_year, report_month;
END;
$$ LANGUAGE plpgsql;
