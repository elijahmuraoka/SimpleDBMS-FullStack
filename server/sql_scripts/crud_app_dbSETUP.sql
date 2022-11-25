-- -----------------------------------------------------
-- Schema CRUD Demo
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `crud_app`;
CREATE SCHEMA IF NOT EXISTS `crud_app` DEFAULT CHARACTER SET utf8 ;
USE `crud_app` ;

-- -----------------------------------------------------
-- Table `crud_app`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `crud_app`.`user`;
CREATE TABLE IF NOT EXISTS `crud_app`.`user` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `date_added` DATE NOT NULL default (CURRENT_DATE),
    PRIMARY KEY (`user_id`)
);
  
-- INSERT into user (name) values
--   ("John");
--   
-- INSERT into user (user_id, name, date_added) values
--   (3, "Aden", '1969-09-11');
--   
--   INSERT into user (user_id, name, date_added) values
--   (4, "AdenLu", '1969-09-11');
--   
-- INSERT into user (user_id, name, date_added) values
--   (2, "Elijah", '2003-06-02');
--   
-- Select & Filter Queries
  
SELECT 
    *
FROM
    user;
    
SELECT 
    *
FROM
    user
ORDER BY user_id;

SELECT 
    *
FROM
    user
ORDER BY date_added;

SELECT 
    *
FROM
    user
WHERE
    name = 'John';
 
-- Reset Indices If No Data 

-- DELIMITER //
-- DROP PROCEDURE if exists reset //
-- CREATE PROCEDURE crud_app.reset()
--        BEGIN
--          If ((select count(*) from user) = 0) THEN
--          ALTER TABLE user auto_increment = 0;
--          END IF;
--        END//
-- DELIMITER ;

-- DELIMITER //
-- drop trigger if exists reset_ids //
-- CREATE TRIGGER reset_ids
-- 	before insert ON user 
-- FOR EACH ROW
-- BEGIN
-- 	-- alter table user auto_increment = 0;
--     call reset();
-- END//
-- -- alter user auto-increment = 0
-- DELIMITER ;
    
show triggers in crud_app;

-- show processlist;