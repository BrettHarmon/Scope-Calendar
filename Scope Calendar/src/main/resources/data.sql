insert into users (user_id, username , password, email)
    Select 1, 'admin', '$2a$10$I9dk//aUXAoTFkN9arY0Du8s/LicyfhJIYx.Sc1qEZ7t4QIBmtcWO', 'admin@self.com'
    WHERE
    NOT EXISTS (
        SELECT user_id FROM users WHERE user_id = 1
    );