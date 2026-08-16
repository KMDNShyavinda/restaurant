-- ------------------------------------------------------------------------------
-- Flyway Database Migration V10: Ensure All Users Have ACTIVE Status
-- ------------------------------------------------------------------------------

UPDATE users SET status = 'ACTIVE' WHERE status IS NULL OR status = '';
