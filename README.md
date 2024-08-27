
# Book API

This project is a RESTful API for managing books, built with NestJS. It provides endpoints for creating, retrieving, updating, and deleting books. This README includes setup instructions, API usage examples, and information on using Swagger UI for testing.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Using Swagger UI for Testing](#using-swagger-ui-for-testing)
- [API Usage Examples](#api-usage-examples)

### Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MySQL (for the database)

### Installation

```bash
$ npm install
```
### Docker Container

```bash
# docker-compose file
$ docker-compose up -d
```
## Running migrations
 
 ```bash
 #generate migrations
 $ npm run migration:generate
 
 #run migrations
 $ npm run migration:run

 #exit migrations
 $ npm run migration:exit

 ```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
### Using Swagger UI for Testing
## Access Swagger UI

Open your browser and go to `http://localhost:3000/api-docs`.

## Interact with the API

Explore Endpoints: Use the Swagger UI to explore all available endpoints.
Try Out Requests: Use the "Try it out" button to test each endpoint. Fill in request parameters and body data as needed and click "Execute" to see the response.
Swagger UI will display the API responses, including status codes, response bodies, and any errors.

## API Usage Examples

## Create a Book
**Endpoint:** `POST /books`

**Request Body:**
```json
{
  "name": "Book Title",
  "Description": "Description of the book",
  "price": 100.00
}
```
 **Response:**
 ```json 
  {
    "error": false,
    "statusCode": 200,
    "message": "Success",
    "displayMessage": false,
    "data":{
      "id": 1,
      "name": "Book Title",
      "Description": "Description of the book",
      "price": 100.00,
      "createdAt": "2024-01-01",
      "updatedAt": "2024-01-01"
    }
  }
  
```

## Get all Books
**Endpoint:** `GET /books`

**Query params:**
```bash

?limit=10&offset=0

```
 **Response:**
 ```json 
 {
  "error": false,
    "statusCode": 200,
    "message": "Success",
    "displayMessage": false,
    "data":[
        {
          "id": 1,
          "name": "Book Title",
          "Description": "Description of the book",
          "price": 100.00,
          "createdAt": "2024-01-01",
          "updatedAt": "2024-01-01"
        },
        {
          "id": 2,
          "name": "Book Title 2",
          "Description": "Description of the book 2",
          "price": 105.00,
          "createdAt": "2024-01-01",
          "updatedAt": "2024-01-01"
        },
    ]
 }
 ```
 ## Update a Book
**Endpoint:** `PUT /books/:id`

**Request Body:**
```json
{
  "name": "Book Title",
  "Description": "Description of the book",
  "price": 100.00
}
```
 **Response:**
 ```json 
  {
    "error": false,
    "statusCode": 200,
    "message": "Success",
    "displayMessage": false,
    "data":{
      "id": 1,
      "name": "Book Title",
      "Description": "Description of the book",
      "price": 100.00,
      "createdAt": "2024-01-01",
      "updatedAt": "2024-01-01"
    }
  }
  
```
 ## Get Book by id
**Endpoint:** `GET /books/:id`

**Query Params:**
```bash
  id=1
```
 **Response:**
 ```json 
  {
    "error": false,
    "statusCode": 200,
    "message": "Success",
    "displayMessage": false,
    "data":{
      "id": 1,
      "name": "Book Title",
      "Description": "Description of the book",
      "price": 100.00,
      "createdAt": "2024-01-01",
      "updatedAt": "2024-01-01"
    }
  }
```
## Delete Book by id
**Endpoint:** `DELETE /books/:id`

**Query Params:**
```bash
  id=1
```
 **Response:**
 ```json 
  {
    "error": false,
    "statusCode": 200,
    "message": "Success",
    "displayMessage": false,
    "data":[]
  }
```