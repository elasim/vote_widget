SELECT
	`Movies`.`title`,
	COUNT(`Movies`.`id`) as `NumberOfVotes`
FROM
	`Movies` JOIN `Users`
		ON `Movies`.`id` = `Users`.`movie_id`
GROUP BY
	`Movies`.`id`;
	