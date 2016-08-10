# Vote Widget

## Schema
![schema](docs/schema.png)
> InnoDB is only option to support foreign key constraint on MySQL.
So, We have to use InnoDB as table storage engine.

## Queries
`query/create-movies.sql`
create movies table and insert 3 sample movie data

`query/create-users.sql`
create users table and insert 10000 random votes using temp procedure

`query/count-votes.sql`
count votes for every movie data on movies table

`query/most-favorite.sql`
select the most favorite movie from users votes and retrieve title of that
