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
insert into organizations (organization_id, description, private, name, owner_id)
Select 1, null, false, 'Empty Organization', 1 
WHERE
NOT EXISTS (  
	SELECT organization_id FROM organizations WHERE organization_id = 1 
);

insert into organizations (organization_id, description, private, name, owner_id)
Select 2, '2018 Schedule for York little league organization', false, 'York County T-Ball', 2 
WHERE
NOT EXISTS (  
	SELECT organization_id FROM organizations WHERE organization_id = 2 
);

insert into events (event_id, description, end_date, name, start_date, time_zone_offset, organization_id)
VALUES 
	(1,'Wednesday practice @Field 1', '2018-03-15 00:00:00', 'Evening wednesday practice', '2018-03-14 22:00:00', -5, 2),
	(2,	'Game Day. Home game: @Field 2', '2018-03-07 01:00:00', 'Marlins vs. Dodgers', '2018-03-06 23:30:00', -5, 2),
	(3,	'Wednesday practice @Field 1', '2018-03-08 01:00:00', 'Evening wednesday practice', '2018-03-07 23:00:00', -5, 2),
	(4, 'Practice. Meet @ Field 2', '2018-03-10 16:30:00', 'Saturday morning practice', '2018-03-10 14:30:00', -5, 2),
	(5, 'Table will be set up in cafeteria', '2018-03-10 19:30:00', 'Saturday Fundraiser', '2018-03-10 18:30:00', -5, 2)
ON CONFLICT DO NOTHING