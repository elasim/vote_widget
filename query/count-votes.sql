SELECT
  `Movies`.`title`,
  COUNT(`Users`.`movie_id`) as `NumberOfVotes`
FROM
  `Movies` LEFT JOIN `Users`
    ON `Movies`.`id` = `Users`.`movie_id`
GROUP BY
  `Movies`.`id`;
