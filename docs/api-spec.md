# API
This describes the resources that make up vote widget API v1


## Table of Contents
1. [Common](#common)
   1. [Protocol](#common-protocol)
   2. [Version](#common-version)
   3. [Cross Origin Resource Sharing (CORS)](#common-cors)
   4. [Client Errors](#common-client-errors)
2. [Movie](#movie)


## 1. Common <a id="common"></a>

### Protocol <a id="common-protocol"></a>
All API must have to access is over HTTPS.
also, All data is sent and recieved as JSON

Most of API methods take optional parameters

 For GET requests, any parameters not specificed as a segment in the path
can be passed as an HTTP query string parameter

 For POST, PATCH, PUT and DELETE requests, parameters not included in the URL
should be encoded as JSON with a Content-Type of "application/json"

### Version <a id="common-version"></a>
By default, all requests receive the v1 version of the API.
You can request specific version via 'Accept' field on the request header
```
Accept: application/vnd.votewidget.v1+json
```
Currently, These versions are available.
- application/vnd.votewidget.v1+json

### Cross Origin Resource Sharing <a id="common-cors"></a>
The API supports Cross Origin Resource Sharing (CORS) for AJAX requests
from any origin.

### Client Errors <a id="common-client-errors"></a>
There are three possible types of client errors
on API calls that receive request body

1. Sending invalid JSON will result in a `400 Bad Request` response
  with message
   ```
   {
     "message": "Problems parsing JSON"
   }
   ```
2. Sending invalid fields will result in a `422 Unprocessable Entity` response
  with message and errors
   ```
   {
     "message": "Invalid parameter",
     "errors": [
       {
         "resource": "Like",
         "field": "movieId",
         "code": "missing_field"
       }
     ]
   }
   ```

   All error objects have resource and field properties so that your client
   can tell what the problem is.
   There's also an error code to let you know what is wrong with the field.
   These are the possible validation error codes

   | Code          | Description
   |---------------|-----------------------------------------------------------
   | not_exist     | This means a resource does not exist
   | missing_field | This means a required field on aresource has not been set 
   | invalid       | This means the formatting of a field is invalid

   > Most of errors will provide a message field describing the error


## Movie <a id="movie"></a>
the Movie APIs provide access to movie information, vote, and vote results

- [List all movies](#movie-list)
- [Vote a movie](#movie-vote)
- [Get vote result](#movie-vote-result)


### List all movies <a id="movie-list"></a>
```
GET /movies
```
#### Parameters
 Name   | Type     | Description         | min | max | default
-------:|:--------:|---------------------|:---:|:---:|:--------:
 offset | unsigned | skip `offset` items | 0   |     | 0
 limit  | unsigned | get `limit` items   | 1   | 100 | 30

#### Response
```
{
  "movies": [
    {
      "id": 1,
      "title": "Sample A",
      "director_name": "Sample A's Director",
      "summary": "This is summary of Sample A"
    },
    {
      "id": 2,
      "title": "Sample B",
      "director_name": "Sample B's Director",
      "summary": "This is summary of Sample B"
    }
  ],
  total: 3,
}
```
 Name          | Type     | Description
---------------|:--------:|-------------------------------------------
 movies        | array    | Retrieved movie informations
 total         | unsigned | Total number of stored movie informations
 id            | unsigned | The key value of movie information
 title         | string   | Title of movie
 director_name | string   | Director of movie
 summary       | string   | Summary of movie


### Vote a movie <a id="movie-vote"></a>
```
PUT /movies/:movie/votes
```
#### Parameters
 Name  | Type     | Description
-------|:--------:|---------------------------------------------------
 movie | unsigned | **Required** key value of specific Movie
 name  | string   | **Required** Username

#### Response
```
{
  "title": "Sample A",
  "votes": 3383
}
```
 Name    | Type     | Description
---------|:--------:|---------------------------------------------------
 title   | string   | Title of movie
 votes   | unsigned | Number of votes


### Get vote result  <a id="movie-vote-result"></a>
```
GET /movies/:movie/votes
```
#### Parmaeters
 Name  | Type     | Description
-------|:--------:|---------------------------------------------------
 movie | unsigned | **Required** key value of specific Movie

#### Response
```
{
  "title": "Sample A",
  "votes": 3383
}
```
 Name    | Type     | Description
---------|:--------:|-------------------------------------------------
 title   | string   | Title of movie
 votes   | unsigned | Number of votes
