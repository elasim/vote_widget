CREATE TABLE IF NOT EXISTS `Movies` (
  id              INT            PRIMARY KEY    AUTO_INCREMENT,
  title           VARCHAR(140)   NOT NULL,
  director_name   VARCHAR(140)   NOT NULL,
  summary         TEXT           NULL
) ENGINE = INNODB;
