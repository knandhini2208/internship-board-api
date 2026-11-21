# Internship Board REST API

A RESTful API for managing internship opportunities, built using Node.js, Express.js, and SQLite. This project provides internship management functionality with CRUD operations, search, filtering, pagination, and input validation.

## Features

- **CRUD Operations:** Create, retrieve, update, and delete internship records.
- **Search:** Search internships by title or domain.
- **Domain Filtering:** Filter internships based on their domain.
- **Work Mode Filtering:** Filter opportunities by Remote, Hybrid, or On-site.
- **Pagination:** Retrieve internship records in manageable pages.
- **Input Validation:** Validate incoming data using express-validator.
- **Duplicate Prevention:** Prevent duplicate internship IDs.
- **SQLite Database:** Store internship and application-related records.
- **Error Handling:** Handle invalid requests, missing records, and server errors.

## Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| SQLite | Database |
| better-sqlite3 | SQLite database integration |
| express-validator | Request validation |
| dotenv | Environment configuration |
| nodemon | Development server |

## Project Structure

```text
internship-board-api/
│
├── config/
│   └── database.js
│
├── controllers/
│   └── internshipController.js
│
├── middleware/
│   └── validate.js
│
├── routes/
│   └── internshipRoutes.js
│
├── utils/
│
├── data/
│   └── internships.db
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/knandhini2208/internship-board-api.git
```

### 2. Navigate to the Project Directory

```bash
cd internship-board-api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000
DB_PATH=./data/internships.db
```

The application uses port 5000 and the specified SQLite database path by default when environment variables are not provided.

### 5. Create the Database Directory

Ensure the `data` directory exists before starting the application.

```bash
mkdir data
```

### 6. Start the Server

For normal execution:

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

The server will run at:

```text
http://localhost:5000
```

The SQLite database and tables are initialized automatically when the application starts.

## API Documentation

Base URL:

```text
http://localhost:5000
```

### 1. Home Route

**GET /**

Checks whether the API is running.

### 2. Health Check

**GET /api/health**

Returns the API health-check response.

### 3. Get All Internships

**GET /api/internships**

Retrieves all internship records.

### 4. Get Internship by ID

**GET /api/internships/:id**

Retrieves a specific internship using its ID.

Example:

```text
GET /api/internships/INT-101
```

### 5. Create Internship

**POST /api/internships**

Creates a new internship record.

Example request body:

```json
{
  "id": "INT-106",
  "title": "Backend Developer Intern",
  "domain": "Full Stack Development",
  "mode": "Remote",
  "location": "India",
  "skills": ["Node.js", "Express.js", "SQLite"],
  "openings": 2
}
```

### 6. Update Internship

**PUT /api/internships/:id**

Updates an existing internship record.

Example:

```text
PUT /api/internships/INT-106
```

Use the same internship fields as the create request.

### 7. Delete Internship

**DELETE /api/internships/:id**

Deletes an internship record using its ID.

Example:

```text
DELETE /api/internships/INT-106
```

## Search and Filtering

The API supports searching and filtering internship records.

### Search by Title or Domain

```text
GET /api/internships?search=Python
```

### Filter by Domain

```text
GET /api/internships?domain=Full Stack Development
```

### Filter by Work Mode

```text
GET /api/internships?mode=Remote
```

### Combined Search and Filtering

```text
GET /api/internships?search=Python&domain=Full Stack Development&mode=Remote
```

## Pagination

The API supports pagination using `page` and `limit` query parameters.

Example:

```text
GET /api/internships?page=1&limit=5
```

Pagination defaults:

- Default page: 1
- Default limit: 5
- Maximum limit: 50
- Minimum page: 1
- Minimum limit: 1

The response includes pagination information such as the current page, limit, total records, and total pages.

## Database Structure

The application uses SQLite with two tables.

### Internships Table

Stores internship information:

- id
- title
- domain
- mode
- location
- skills
- openings

### Applications Table

Stores applicant-related information:

- id
- internship_id
- applicant_name
- applicant_email
- created_at

The applications table includes a foreign key relationship with the internships table and prevents duplicate applications for the same internship and email address.

Deleting an internship also deletes its associated application records through the configured cascade constraint.

The application currently exposes internship-related API endpoints; application submission endpoints are not included.

## Input Validation

The API validates internship data before processing requests.

Validation rules include:

- Internship ID is required when creating a record.
- Title and domain cannot be empty.
- Work mode must be Remote, Hybrid, or On-site.
- Location is required.
- Skills must be a non-empty array of non-empty strings.
- Openings must be a non-negative integer.

Invalid requests return HTTP 400 with detailed validation error messages.

## Error Handling

The API handles common errors:

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Validation failed |
| 404 | Internship or route not found |
| 409 | Duplicate internship ID |
| 500 | Internal server error |

## Sample Internship Data

The database is initialized with five sample internship records:

- Frontend Intern
- API Engineer Intern
- UI/UX Intern
- Data Analyst Intern
- Security Operations Intern

Sample records are inserted using `INSERT OR IGNORE` to avoid duplicate entries during database initialization.

## Author

**K. Nandhini**

GitHub: [knandhini2208](https://github.com/knandhini2208)

## License

This project is licensed under the ISC License.
