-- ------------------------------------------------------------------------------
-- Flyway Database Migration V11: Reset Demo User Passwords to BCrypt('password123')
-- ------------------------------------------------------------------------------

UPDATE users 
SET password_hash = '$2a$10$dLw5u2yyPYA5u4bBevdBIOungR4HooekiMoVFov55IR7bwvMbZwKO',
    status = 'ACTIVE';
