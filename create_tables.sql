
drop table client_type;
drop table client;
drop table client_contact;


CREATE TABLE client_type (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(200) NOT NULL,
PRIMARY KEY (id));

CREATE TABLE client_contact(id INT NOT NULL AUTO_INCREMENT,
client_id int,
p_contact VARCHAR(200) NOT NULL,
p_email VARCHAR(200) NOT NULL,
p_phone VARCHAR(200) NOT NULL,
alt_contact VARCHAR(200),
alt_email VARCHAR(200),
alt_phone VARCHAR(200),
primary key(id,client_id));

create index client_contact_id_idx on client_contact (client_id);

create table client
(id INT ,
name VARCHAR(200) NOT NULL,
business_unit VARCHAR(200),
client_type INT,
job_title VARCHAR(200),
dep VARCHAR(200),
client_group int,
CONSTRAINT fk_type FOREIGN KEY(client_type) REFERENCES client_type(id),
CONSTRAINT fk_client_id FOREIGN KEY(id) REFERENCES client_contact(client_id),
PRIMARY KEY(ID));