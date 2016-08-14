DROP PROCEDURE IF EXISTS create_random_users;
CREATE PROCEDURE create_random_users(counts INT)
BEGIN
  DECLARE userNo INT UNSIGNED DEFAULT 1;
  WHILE userNo < counts DO
    INSERT INTO `Users` (name, movie_id)
      SELECT
        CONCAT('User', userNo),
        `Movies`.`id`
      FROM Movies
      ORDER BY RAND()
      LIMIT 1;
    SET userNo = userNo + 1;
  END WHILE;
END;

/* Create Random Vote Samples */
CALL create_random_users(10000);
DROP PROCEDURE create_random_users;
