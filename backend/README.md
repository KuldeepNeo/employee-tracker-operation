# Employee CRUD Backend API

This is the backend API for the Employee Data Tracking Web Application. It is built using Node.js, Express, and SQLite.

## Tech Stack
- **Node.js**: v24.16.0 (or newer compatible versions)
- **Express**: v5.x
- **SQLite**: v3.x

---

## 1. Setup Instructions

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` (it has default options loaded):
   ```bash
   cp .env.example .env
   ```

---

## 2. Running the Application

- **Start production server**:
  ```bash
  npm start
  ```

- **Start development server (nodemon)**:
  ```bash
  npm run dev
  ```

The server will automatically generate the database schema and indexes in `database.sqlite` (or the custom path specified in `DATABASE_PATH` in `.env`) if they do not exist.

---

## 3. Running Tests

The test suite runs using `Jest` and `Supertest` on an isolated `:memory:` database:

```bash
npm test
```

---

## 4. API Documentation Summary

All endpoints request/response bodies are formatted in JSON.

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| `GET` | `/employee` | Retrieve list of all employees | `200 OK` |
| `GET` | `/employee/:id` | Retrieve specific employee by integer identifier | `200 OK` |
| `POST` | `/employee` | Create a new employee record | `201 Created` |
| `PUT` | `/employee/:id` | Update an existing employee record | `200 OK` |
| `DELETE` | `/employee/:id` | Permanently delete an employee record | `200 OK` |

### Success response example:
```json
{
  "success": true,
  "data": {
    "employee_id": 1,
    "employee_code": "EMP001",
    "employee_name": "John Doe",
    "phone_number": "9876543210",
    "designation": "Software Engineer",
    "department": "IT",
    "created_at": "2026-06-05T10:00:00Z",
    "updated_at": "2026-06-05T10:00:00Z"
  }
}
```

### Error response example:
```json
{
  "success": false,
  "message": "Employee code already exists.",
  "errors": {
    "employee_code": [
      "Employee code already exists."
    ]
  }
}
```
