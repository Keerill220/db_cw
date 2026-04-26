-- Trigger 4: Auto-update updated_at on Studios, Administrators, and Clients.
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_studio_updated_at ON studios;
CREATE TRIGGER trg_studio_updated_at
    BEFORE UPDATE ON studios
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

DROP TRIGGER IF EXISTS trg_admin_updated_at ON administrators;
CREATE TRIGGER trg_admin_updated_at
    BEFORE UPDATE ON administrators
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

DROP TRIGGER IF EXISTS trg_client_updated_at ON clients;
CREATE TRIGGER trg_client_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
