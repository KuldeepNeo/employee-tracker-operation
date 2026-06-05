# database-design.md

## Employee Data Tracking Web Application

**Folder Path** database/
**Database:** SQLite

---

# 1. Entity List

Based on the project scope and KPI requirements, the application requires a single core business entity:

| Entity   | Purpose                                                  |
| -------- | -------------------------------------------------------- |
| Employee | Stores employee information and supports CRUD operations |

Since authentication, audit logging, reporting, notifications, payroll, and attendance tracking are explicitly out of scope, no additional entities are required for the initial release. 

---

# 2. Table Definitions

## Employee

Stores all employee records managed by the application.

| Column        | Type     | Required | Description                  |
| ------------- | -------- | -------- | ---------------------------- |
| employee_id   | INTEGER  | Yes      | Internal primary key         |
| employee_code | TEXT     | Yes      | Business employee identifier |
| employee_name | TEXT     | Yes      | Full employee name           |
| phone_number  | TEXT     | Yes      | Contact number               |
| designation   | TEXT     | Yes      | Job title                    |
| department    | TEXT     | Yes      | Department name              |
| created_at    | DATETIME | Yes      | Record creation timestamp    |
| updated_at    | DATETIME | Yes      | Last modification timestamp  |

---

# 3. Column Definitions

## employee_id

* System-generated unique identifier
* Used as primary key
* Never exposed as business identifier

## employee_code

* Unique employee reference
* Corresponds to Employee ID from requirements
* Used for searching and display

## employee_name

* Stores employee full name
* Mandatory field

## phone_number

* Stores employee contact number
* Stored as text to preserve formatting and country codes

## designation

* Stores employee job title
* Examples:

  * Software Engineer
  * HR Manager
  * Accountant

## department

* Stores department name
* Examples:

  * IT
  * HR
  * Finance
  * Operations

## created_at

* Timestamp when record is created

## updated_at

* Timestamp when record is modified

---

# 4. Data Types

| Column        | SQLite Type |
| ------------- | ----------- |
| employee_id   | INTEGER     |
| employee_code | TEXT        |
| employee_name | TEXT        |
| phone_number  | TEXT        |
| designation   | TEXT        |
| department    | TEXT        |
| created_at    | DATETIME    |
| updated_at    | DATETIME    |

### Data Type Rationale

**INTEGER**

* Efficient primary key storage
* Auto-increment capability

**TEXT**

* Flexible string storage
* Supports varying lengths

**DATETIME**

* Supports audit timestamps
* Useful for future reporting and maintenance

---

# 5. Constraints

## Employee Table Constraints

| Constraint       | Type        | Description                  |
| ---------------- | ----------- | ---------------------------- |
| PK_EMPLOYEE      | Primary Key | employee_id must be unique   |
| UK_EMPLOYEE_CODE | Unique      | employee_code must be unique |
| NN_EMPLOYEE_NAME | Not Null    | employee_name required       |
| NN_EMPLOYEE_CODE | Not Null    | employee_code required       |
| NN_PHONE         | Not Null    | phone_number required        |
| NN_DESIGNATION   | Not Null    | designation required         |
| NN_DEPARTMENT    | Not Null    | department required          |
| NN_CREATED_AT    | Not Null    | created_at required          |
| NN_UPDATED_AT    | Not Null    | updated_at required          |

### Business Rules

1. Employee Code must be unique.
2. Employee Name cannot be empty.
3. Phone Number cannot be empty.
4. Designation cannot be empty.
5. Department cannot be empty.
6. Deleted records are permanently removed (hard delete) as specified by scope. 

---

# 6. Primary Keys

## Employee

| Table    | Primary Key |
| -------- | ----------- |
| Employee | employee_id |

### Key Strategy

* Surrogate key approach
* Integer-based primary key
* Optimized for SQLite performance
* Independent from business employee identifiers

---

# 7. Foreign Keys

### Initial Release

No foreign keys are required because the database contains only one business entity.

| Table    | Foreign Keys |
| -------- | ------------ |
| Employee | None         |

### Future Expansion

Potential foreign key relationships:

| Child Table    | Parent Table |
| -------------- | ------------ |
| Employee       | Department   |
| Employee       | Designation  |
| Employee_Audit | Employee     |

---

# 8. Index Strategy

## Primary Index

| Index       | Columns     | Purpose            |
| ----------- | ----------- | ------------------ |
| PK_Employee | employee_id | Fast record lookup |

## Unique Index

| Index            | Columns       | Purpose            |
| ---------------- | ------------- | ------------------ |
| UX_Employee_Code | employee_code | Enforce uniqueness |

## Search Optimization Indexes

| Index            | Columns       | Purpose               |
| ---------------- | ------------- | --------------------- |
| IX_Employee_Name | employee_name | Employee search       |
| IX_Department    | department    | Department filtering  |
| IX_Designation   | designation   | Designation filtering |

### Performance Benefits

Supports KPI requirements:

* Fast employee retrieval
* CRUD response time ≤ 2 seconds
* Efficient employee maintenance operations
* Scalable employee listing performance 

---

# 9. Future Scalability

Although the MVP contains a single Employee table, the database should support future growth.

## Potential Future Entities

### Department

| Column          |
| --------------- |
| department_id   |
| department_name |

### Designation

| Column           |
| ---------------- |
| designation_id   |
| designation_name |

### Employee Audit

| Column      |
| ----------- |
| audit_id    |
| employee_id |
| action_type |
| changed_by  |
| changed_at  |

### User

| Column   |
| -------- |
| user_id  |
| username |
| role     |

---

## Scalability Recommendations

### Phase 1 (Current Scope)

* Single Employee table
* SQLite database
* CRUD API integration

### Phase 2

* Normalize Department data
* Normalize Designation data
* Introduce lookup tables

### Phase 3

* Audit tracking
* User management
* Role-based access control

### Phase 4

* Migration path to PostgreSQL/MySQL
* Reporting layer
* Analytics support
* High-volume employee management

---

# Entity Relationship Diagram (Markdown)

```text
+--------------------------------------------------+
|                    Employee                      |
+--------------------------------------------------+
| PK employee_id : INTEGER                         |
| UK employee_code : TEXT                          |
| employee_name : TEXT                             |
| phone_number : TEXT                              |
| designation : TEXT                               |
| department : TEXT                                |
| created_at : DATETIME                            |
| updated_at : DATETIME                            |
+--------------------------------------------------+

(Current Release)

Employee
   |
   | No Foreign Key Relationships
   |
   +-- Standalone Entity

(Future Expansion)

Department (1) -----------< Employee (M)

Designation (1) ----------< Employee (M)

Employee (1) ------------< Employee_Audit (M)
```

## Design Summary

The SQLite database design is intentionally simple because the project scope only requires employee CRUD management. The design provides:

* Centralized employee information storage
* High data integrity through constraints
* Fast CRUD operations through targeted indexing
* Support for KPI performance targets
* Clear migration path for future business growth and normalization  
