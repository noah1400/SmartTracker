# Server Service

# Database

This document outlines the database schema design for a cloud-based time tracking application. The application allows users to track their working time on different projects and can operate both standalone and with a server connection.

## Overview

The database comprises three main tables:

1. **Users**: Stores user information and credentials.
2. **Projects**: Stores data related to projects on which users are working.
3. **Time Entries**: Logs individual user's time entries for various projects.

### Users Table

This table holds the user's data, including authentication details. Each user has a unique `id`, and their password is stored in an encrypted format.

- **TableName**: `users`
  
  | Column Name | Data Type | Description |
  | --- | --- | --- |
  | id | Integer | Primary key, unique identifier for a user |
  | username | String | User's unique username |
  | email | String | User's email address, unique |
  | password | String | Encrypted user's password (null if external auth) |
  | auth_method | String | Authentication method used ('INTERNAL', 'LDAP', 'LINUX', etc.) |
  | created_at | DateTime | Timestamp when the user was created |
  | updated_at | DateTime | Timestamp when the user's data was last updated |

### Projects Table

This table contains information about various projects that users can log time against. Each project has a unique `id` and a name.

- **TableName**: `projects`

  | Column Name | Data Type | Description |
  | --- | --- | --- |
  | id | Integer | Primary key, unique identifier for a project |
  | project_name | String | Name of the project |
  | created_at | DateTime | Timestamp when the project was created |
  | updated_at | DateTime | Timestamp when the project was last updated |

### Time Entries Table

This table logs the time entries for users on various projects. Each time entry records the start and end times of a user's work on a project on a particular date.

- **TableName**: `time_entries`

  | Column Name | Data Type | Description |
  | --- | --- | --- |
  | id | Integer | Primary key, unique identifier for a time entry |
  | user_id | Integer | ID of the user logging the time, foreign key to `users` table |
  | project_id | Integer | ID of the project on which time is logged, foreign key to `projects` table |
  | start_time | DateTime | Start time of the work |
  | end_time | DateTime | End time of the work |
  | date | DateTime | The date when the work was performed |
  | created_at | DateTime | Timestamp when the time entry was created |
  | updated_at | DateTime | Timestamp when the time entry was last updated |

## Relationships

- Each `User` can have multiple `Time Entries`, but each `Time Entry` belongs to one `User`.
- Each `Project` can have multiple `Time Entries`, but each `Time Entry` is associated with one `Project`.

## Authentication Flow

- The user sends a login request with username and password.
- The service checks the `users` table for valid credentials.
- If authenticated internally, a JWT token is issued.
- If internal authentication fails, the system attempts to authenticate through registered external services (e.g., LDAP, Linux login) sequentially.
- If authenticated externally, the user record is "upserted" in the `users` table, indicating the `auth_method` used, and a JWT token is issued.

## Notes

- Passwords are stored in an encrypted format using appropriate security standards.
- External authentication methods are logged under the `auth_method` column in the `users` table.
- All timestamps are stored in UTC.
- The system should enforce referential integrity between `Users`, `Projects`, and `Time Entries`.
