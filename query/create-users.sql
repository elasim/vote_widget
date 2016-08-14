CREATE TABLE IF NOT EXISTS `Users` (
  id            INT            PRIMARY KEY    AUTO_INCREMENT,
  name          VARCHAR(140)   NOT NULL,
  movie_id      INT,
  FOREIGN KEY (movie_id)
    REFERENCES Movies(id) ON DELETE CASCADE
) ENGINE = INNODB;
