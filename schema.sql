create table account (
id bigint not null auto_increment,
partner varchar(64) not null,
partner_user_id varchar(128) not null,
email varchar(255) not null,
token varchar(255) not null,
status enum('ENABLED','FROZEN') not null default 'ENABLED',
created_at datetime not null default current_timestamp,
updated_at datetime not null default current_timestamp on update current_timestamp,
primary key(id),
unique key uq_account_partner_user_id (partner_user_id)
) ENGINE=InnoDB default CHARSET=utf8mb4;

create table schedule (
id varchar(32) not null,
account_id bigint not null,
title varchar(256) not null,
description text null,
type varchar(16) not null,
start_time datetime null,
end_time datetime null,
location varchar(256) null,
repeat_type varchar(16) not null,
created_at datetime not null default current_timestamp,
updated_at datetime not null default current_timestamp on update current_timestamp,
primary key(id),
constraint fk_schedule_account foreign key(account_id) references account (id)
) ENGINE=InnoDB default CHARSET=utf8mb4;

create table reminder (
id varchar(32) not null,
schedule_id varchar(32) not null,
type varchar(16) not null,
reminder_time int not null,
time_level varchar(8) not null,
repeat_interval int null,
fire_time datetime null,
status varchar(16) not null default 'PENDING',
created_at datetime not null default current_timestamp,
updated_at datetime not null default current_timestamp on update current_timestamp,
primary key(id),
constraint fk_reminder_schedule foreign key (schedule_id) references schedule (id) on delete cascade
) ENGINE=InnoDB default CHARSET=utf8mb4;

create table request_log (
id bigint not null auto_increment,
partner varchar(64) not null,
request_id char(32) not null,
response_body text not null,
created_at datetime not null default current_timestamp,
primary key (id),
unique key uq_request_log (partner, request_id)
) ENGINE=InnoDB default CHARSET=utf8mb4;