# Experiment 8: RESTful Book Collection API using Node.js and Express.js

**Student:** Shreyash Sinha  
**Repository:** [shreyashsinha14/web-dev-lab](https://github.com/shreyashsinha14/web-dev-lab)

## Aim
To build a simple RESTful API using Node.js and Express.js for managing a collection of books through CRUD (Create, Read, Update, and Delete) operations.

## Software Requirements
- Node.js and npm
- Visual Studio Code (or any code editor)
- Postman, Thunder Client, or curl for sending HTTP requests

## Project Structure
```text
Experiment 8/
├── package.json
├── server.js
└── README.md
```

## Description
The application uses Express.js to define API endpoints and the built-in JSON middleware to read request bodies. Book records contain an ID, title, author, and publication year. The sample project stores records in an in-memory array, so changes are reset whenever the server restarts.

## Installation and Execution
1. Install Node.js on your computer.
2. Open a terminal in the `Experiment 8` folder.
3. Install the project dependencies:
   ```bash
   npm install
   ```
4. Start the API server:
   ```bash
   npm start
   ```
5. The server runs at `http://localhost:3000`.

## Deploying on Render

This repository includes a root-level `render.yaml` Blueprint for deploying this API as a Node.js web service.

1. Sign in to [Render](https://render.com/).
2. From the dashboard, choose **New** → **Blueprint**.
3. Connect your GitHub account if prompted, then select `shreyashsinha14/web-dev-lab` and the `main` branch.
4. Render detects the root-level `render.yaml`. Review the `shreyash-book-api` web service and apply the Blueprint.
5. Wait for the first deployment to finish. Render will show the public service URL.
6. Test the live endpoints by adding `/health` and `/api/books` to that URL.

The Blueprint sets the service root to `Experiment 8`, runs `npm install` to install dependencies, and starts the server with `npm start`. Render supplies the `PORT` environment variable, which the app reads automatically.

**Important:** This practical uses an in-memory array, not a database. Books added or changed through the API are not durable and can be lost whenever the service restarts or is redeployed. Use a database for persistent production data.

## API Endpoints

| Method | Endpoint | Operation |
|---|---|---|
| GET | `/api/books` | Read all books |
| GET | `/api/books/:id` | Read a book by ID |
| POST | `/api/books` | Create a new book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

## Testing the CRUD Operations

### 1. Create a book
Send a `POST` request to `http://localhost:3000/api/books` with body type JSON:
```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "year": 2018
}
```
Expected status: `201 Created`.

### 2. Read all books
Send a `GET` request to `http://localhost:3000/api/books`. The response contains the number of books and the complete book array.

### 3. Read one book
Send a `GET` request to `http://localhost:3000/api/books/1` to retrieve the book whose ID is 1.

### 4. Update a book
Send a `PUT` request to `http://localhost:3000/api/books/1` with a JSON body:
```json
{
  "title": "The Alchemist - Updated",
  "author": "Paulo Coelho",
  "year": 1988
}
```
Expected status: `200 OK`.

### 5. Delete a book
Send a `DELETE` request to `http://localhost:3000/api/books/1`. The response confirms the deleted record.

## Important Status Codes
- `200 OK`: Request completed successfully.
- `201 Created`: A new book was created.
- `400 Bad Request`: Invalid ID, input, or JSON body.
- `404 Not Found`: The requested book or route does not exist.

## Result
A RESTful Book Collection API was successfully implemented using Node.js and Express.js. It supports all four CRUD operations, validates incoming data, and returns appropriate HTTP status codes and JSON responses.
