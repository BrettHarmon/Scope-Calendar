insert into users (user_id, username , password, email)
    Select 1, 'admin', '$2a$10$I9dk//aUXAoTFkN9arY0Du8s/LicyfhJIYx.Sc1qEZ7t4QIBmtcWO', 'admin@self.com'  --admin/admin login
    WHERE
    NOT EXISTS (
        SELECT user_id FROM users WHERE user_id = 1
    );

    insert into users (user_id, username , password, email)
    Select 2, 'John_Rando', 'fasdfasdfasdfasdf', 'asdf34bv23@self.com' 
    WHERE
    NOT EXISTS (
        SELECT user_id FROM users WHERE user_id = 2
    );



    insert into organizations (organization_id, name , description, owner_id)
    Select 1, 'York County T-Ball', '2018 Schedule for York little league organization', 2 
    WHERE
    NOT EXISTS (  SELECT organization_id FROM organizations WHERE organization_id = 1 )
    AND
    EXISTS ( SELECT user_id FROM users WHERE user_id = 2 );