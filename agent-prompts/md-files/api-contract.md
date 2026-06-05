# api-contract.md

# Employee Data Tracking Web Application

## API Contract Specification

**Version:** 1.0
**API Style:** REST
**Data Format:** JSON
**Database:** SQLite

---

# 1. API Overview

The Employee Data Tracking Web Application exposes RESTful endpoints for managing employee records.

Supported operations:

* Create Employee
* Retrieve Employee List
* Retrieve Employee Details
* Update Employee Information
* Delete Employee Record

---

# Employee Resource Model

## Employee Object

| Field         | Type     | Required         | Description                  |
| ------------- | -------- | ---------------- | ---------------------------- |
| employee_id   | Integer  | System Generated | Internal unique identifier   |
| employee_code | String   | Yes              | Business employee identifier |
| employee_name | String   | Yes              | Employee full name           |
| phone_number  | String   | Yes              | Employee contact number      |
| designation   | String   | Yes              | Employee designation         |
| department    | String   | Yes              | Employee department          |
| created_at    | DateTime | System Generated | Record creation timestamp    |
| updated_at    | DateTime | System Generated | Record update timestamp      |

---

# 2. GET /employee

## Purpose

Retrieve all employee records.

---

## Request

### Method

GET

### URL

```text
/employee
```

### Request Body

None

### Query Parameters

None (Version 1)

---

## Response

### Success Response

**Status: 200 OK**

```json
{
  "success": true,
  "data": [
    {
      "employee_id": 1,
      "employee_code": "EMP001",
      "employee_name": "John Smith",
      "phone_number": "9876543210",
      "designation": "Software Engineer",
      "department": "IT",
      "created_at": "2026-06-05T10:00:00Z",
      "updated_at": "2026-06-05T10:00:00Z"
    }
  ]
}
```

---

## Validation Rules

* No request validation required.
* Endpoint must return current employee records.

---

## Status Codes

| Code | Meaning                          |
| ---- | -------------------------------- |
| 200  | Employees retrieved successfully |
| 500  | Internal server error            |

---

## Error Response

```json
{
  "success": false,
  "message": "Unable to retrieve employee records."
}
```

---

# 3. GET /employee/:id

## Purpose

Retrieve a specific employee by identifier.

---

## Request

### Method

GET

### URL

```text
/employee/{id}
```

### Path Parameters

| Parameter | Type    | Required |
| --------- | ------- | -------- |
| id        | Integer | Yes      |

---

## Response

### Success Response

**Status: 200 OK**

```json
{
  "success": true,
  "data": {
    "employee_id": 1,
    "employee_code": "EMP001",
    "employee_name": "John Smith",
    "phone_number": "9876543210",
    "designation": "Software Engineer",
    "department": "IT",
    "created_at": "2026-06-05T10:00:00Z",
    "updated_at": "2026-06-05T10:00:00Z"
  }
}
```

---

## Validation Rules

* id must be numeric.
* id must be greater than zero.
* Employee record must exist.

---

## Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Employee found        |
| 400  | Invalid identifier    |
| 404  | Employee not found    |
| 500  | Internal server error |

---

## Error Responses

### Invalid ID

```json
{
  "success": false,
  "message": "Invalid employee identifier."
}
```

### Employee Not Found

```json
{
  "success": false,
  "message": "Employee not found."
}
```

---

# 4. POST /employee

## Purpose

Create a new employee record.

---

## Request

### Method

POST

### URL

```text
/employee
```

### Request Body

```json
{
  "employee_code": "EMP001",
  "employee_name": "John Smith",
  "phone_number": "9876543210",
  "designation": "Software Engineer",
  "department": "IT"
}
```

---

## Validation Rules

### employee_code

* Required
* Must be unique
* Maximum 50 characters

### employee_name

* Required
* Maximum 100 characters

### phone_number

* Required
* Maximum 20 characters

### designation

* Required
* Maximum 100 characters

### department

* Required
* Maximum 100 characters

---

## Response

### Success Response

**Status: 201 Created**

```json
{
  "success": true,
  "message": "Employee created successfully.",
  "data": {
    "employee_id": 1
  }
}
```

---

## Status Codes

| Code | Meaning                 |
| ---- | ----------------------- |
| 201  | Employee created        |
| 400  | Validation error        |
| 409  | Duplicate employee code |
| 500  | Internal server error   |

---

## Error Responses

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "employee_name": [
      "Employee name is required."
    ]
  }
}
```

### Duplicate Employee Code

```json
{
  "success": false,
  "message": "Employee code already exists."
}
```

---

# 5. PUT /employee/:id

## Purpose

Update an existing employee record.

---

## Request

### Method

PUT

### URL

```text
/employee/{id}
```

### Request Body

```json
{
  "employee_code": "EMP001",
  "employee_name": "John Smith",
  "phone_number": "9876543210",
  "designation": "Senior Software Engineer",
  "department": "IT"
}
```

---

## Validation Rules

### Path Parameter

* id must be numeric
* id must exist

### Request Fields

* employee_code required
* employee_name required
* phone_number required
* designation required
* department required
* employee_code must remain unique

---

## Response

### Success Response

**Status: 200 OK**

```json
{
  "success": true,
  "message": "Employee updated successfully."
}
```

---

## Status Codes

| Code | Meaning                 |
| ---- | ----------------------- |
| 200  | Employee updated        |
| 400  | Validation error        |
| 404  | Employee not found      |
| 409  | Duplicate employee code |
| 500  | Internal server error   |

---

## Error Responses

### Employee Not Found

```json
{
  "success": false,
  "message": "Employee not found."
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed."
}
```

---

# 6. DELETE /employee/:id

## Purpose

Delete an employee record.

---

## Request

### Method

DELETE

### URL

```text
/employee/{id}
```

### Request Body

None

---

## Validation Rules

* id must be numeric.
* id must be greater than zero.
* Employee must exist.

---

## Response

### Success Response

**Status: 200 OK**

```json
{
  "success": true,
  "message": "Employee deleted successfully."
}
```

---

## Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Employee deleted      |
| 400  | Invalid identifier    |
| 404  | Employee not found    |
| 500  | Internal server error |

---

## Error Responses

### Invalid Identifier

```json
{
  "success": false,
  "message": "Invalid employee identifier."
}
```

### Employee Not Found

```json
{
  "success": false,
  "message": "Employee not found."
}
```

---

# Standard Error Response Format

All API endpoints should return errors using a consistent structure.

```json
{
  "success": false,
  "message": "Human readable error message",
  "errors": {}
}
```

---

# API Design Principles

1. RESTful resource naming conventions.
2. JSON request and response payloads.
3. Consistent success and error response structures.
4. Validation performed before database operations.
5. Unique employee_code enforcement.
6. Proper HTTP status code usage.
7. Stateless API communication.
8. Compatibility with future pagination, filtering, and search enhancements.

```
```
