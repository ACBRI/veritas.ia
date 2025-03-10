# Veritas.ai Backend

Backend implementation for the electoral monitoring application that handles anonymous geolocation-based reports.

## Features

- RESTful API for report management
- Real-time WebSocket updates
- Geospatial queries with PostGIS
- Rate limiting and spam protection
- Report expiration system
- Report confirmation system

## Tech Stack

- FastAPI - Modern, fast web framework
- PostgreSQL + PostGIS - Spatial database
- Redis - Rate limiting and caching
- SQLAlchemy + GeoAlchemy2 - ORM with spatial support
- WebSockets - Real-time updates
- Pydantic - Data validation

## Prerequisites

- Python 3.8+
- PostgreSQL 12+ with PostGIS extension
- Redis server

## Setup

1. Create PostgreSQL database and enable PostGIS:

```sql
CREATE DATABASE veritas;
\c veritas
CREATE EXTENSION postgis;
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure environment variables (create .env file):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/veritas
REDIS_URL=redis://localhost:6379/0
```

4. Run migrations:

```bash
alembic upgrade head
```

5. Start the server:

```bash
uvicorn app.main:app --reload
```

## API Endpoints

### Reports

- `POST /reports/` - Create new report
- `GET /reports/` - Get reports with filters (bbox, type, active)
- `PUT /reports/{id}/confirm` - Confirm existing report

### Electoral Offenses

- `GET /electoral-offenses/` - Get list of electoral offense types

### WebSocket

- `WS /ws` - Real-time updates for reports and confirmations

## Security Features

- Rate limiting by IP address
- Ephemeral tokens for report submission
- Anti-spam filters
- Input validation
- CORS protection

## Database Schema

### Reports Table
- id (UUID) - Primary key
- offense_type_id (int) - Reference to electoral_offenses
- location (Geography) - PostGIS point
- created_at (timestamp) - Creation time
- expires_at (timestamp) - Expiration time
- confirmation_count (int) - Number of confirmations
- is_active (boolean) - Report status
- accuracy (float) - GPS accuracy in meters

### Electoral Offenses Table
- id (int) - Primary key
- name (string) - Offense name
- description (string) - Detailed description
- icon_url (string) - URL to offense icon

## Spatial Indexing

The application uses PostGIS spatial indexes for efficient geolocation queries:

```sql
CREATE INDEX idx_reports_location ON reports USING GIST (location);
```

## Rate Limiting

- 5 requests per 5 minutes per IP
- Applies to report creation and confirmation
- Managed through Redis

## WebSocket Protocol

Messages are JSON formatted with the following types:
- `new_report` - New report created
- `confirmation_update` - Report confirmation count updated
- `heartbeat` - Keep-alive message

## Error Handling

- 429 Too Many Requests - Rate limit exceeded
- 404 Not Found - Report not found
- 400 Bad Request - Invalid input data
- 500 Internal Server Error - Server-side issues
