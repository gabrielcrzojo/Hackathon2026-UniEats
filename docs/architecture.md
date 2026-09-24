# UniEats — Architecture

## Overview

UniEats is a web platform that combines an **accreditation management system** with a **public marketplace** for vendors operating inside educational institutions. The architecture follows a layered, role-based design with a clear separation between public and authenticated areas.

---

## System Context

```
┌──────────────────────────────────────────────────────────┐
│                      UniEats Platform                    │
│                                                          │
│  ┌─────────────┐   ┌─────────────┐   ┌───────────────┐  │
│  │   Student   │   │   Vendor    │   │  Admin        │  │
│  │ (anonymous) │   │(authenticated)│ │(authenticated)│  │
│  └──────┬──────┘   └──────┬──────┘   └───────┬───────┘  │
│         │                 │                  │           │
│  ┌──────▼─────────────────▼──────────────────▼───────┐   │
│  │                   Web Application                 │   │
│  │         (React SPA + REST API)                    │   │
│  └───────────────────────┬───────────────────────────┘   │
│                          │                               │
│  ┌───────────────────────▼───────────────────────────┐   │
│  │                    Backend API                    │   │
│  │              (Business Logic Layer)               │   │
│  └───────────────────────┬───────────────────────────┘   │
│                          │                               │
│  ┌───────────────────────▼───────────────────────────┐   │
│  │                  PostgreSQL Database               │   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## Architecture Style

- **Frontend:** Single Page Application (SPA) — React
- **Backend:** RESTful API
- **Database:** Relational (PostgreSQL)
- **Storage:** File storage for uploaded documents (e.g., S3-compatible or local)
- **Auth:** JWT-based authentication with role-based access control (RBAC)

---

## Layers

### 1. Presentation Layer (Frontend — React)

Handles all UI rendering and user interactions. Split into three main areas:

| Area | Access | Description |
|---|---|---|
| **Marketplace** | Public | Browse vendors, products, and locations |
| **Vendor Panel** | Authenticated (Vendor) | Manage profile, documents, products, and availability |
| **Admin Panel** | Authenticated (Admin) | Review accreditation requests, manage vendors and locations |

### 2. API Layer (Backend)

Exposes RESTful endpoints consumed by the frontend. Responsible for:

- Authentication and authorization
- Business rule enforcement
- Data validation
- File handling (document uploads)
- QR code generation
- Scheduled jobs (document expiry checks)

### 3. Data Layer (PostgreSQL)

Persists all application data. Key entities described in the [Data Model](#data-model) section.

---

## Module Breakdown

### Public Module (`/marketplace`)
- List and search regular vendors
- View vendor page (products, location, availability)
- WhatsApp contact link
- QR code verification page

### Auth Module (`/auth`)
- Vendor registration and login
- Admin login
- JWT token issuance and refresh
- Password hashing (bcrypt)

### Vendor Module (`/vendor`)
- Profile management
- Accreditation request flow
- Document upload
- Product CRUD (create, read, update, delete)
- Availability toggle
- Location selection (from pre-approved spots)

### Admin Module (`/admin`)
- Dashboard with summary and alerts
- Accreditation review (approve / reject / suspend)
- Document validation and expiry tracking
- Sales point management

### Document Module (`/documents`)
- Upload and storage
- Expiry date tracking
- Alert generation (30-day warning)
- Auto-status update on expiry (Regular → Pending)

### QR Code Module (`/qrcode`)
- Generate unique QR code per vendor on approval
- QR code active only while vendor status is `Regular`
- Public endpoint to render vendor regularization info

---

## Data Model

### `users`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| email | VARCHAR | Unique |
| password_hash | VARCHAR | bcrypt |
| role | ENUM | `vendor`, `admin` |
| created_at | TIMESTAMP | |

### `vendors`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, FK → users |
| name | VARCHAR | Display name |
| phone | VARCHAR | WhatsApp number |
| status | ENUM | `pending_review`, `regular`, `pending_docs`, `rejected`, `suspended` |
| sales_point_id | UUID | FK → sales_points (nullable) |
| available | BOOLEAN | Attendance availability |
| qr_code_token | VARCHAR | Unique token for QR code |
| created_at | TIMESTAMP | |

### `products`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| vendor_id | UUID | FK → vendors |
| name | VARCHAR | |
| price | NUMERIC(10,2) | |
| description | TEXT | Optional |
| active | BOOLEAN | |
| created_at | TIMESTAMP | |

### `documents`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| vendor_id | UUID | FK → vendors |
| type | VARCHAR | e.g., "Alvará Sanitário" |
| file_path | VARCHAR | Storage path |
| expires_at | DATE | |
| status | ENUM | `pending`, `approved`, `rejected`, `expired` |
| uploaded_at | TIMESTAMP | |

### `accreditation_requests`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| vendor_id | UUID | FK → vendors |
| status | ENUM | `under_review`, `approved`, `rejected` |
| reviewed_by | UUID | FK → users (admin) |
| reviewed_at | TIMESTAMP | Nullable |
| notes | TEXT | Admin notes |
| created_at | TIMESTAMP | |

### `sales_points`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR | e.g., "Bloco B — Entrada principal" |
| description | TEXT | Optional |
| active | BOOLEAN | |
| created_at | TIMESTAMP | |

---

## Vendor Status Flow

```
[Registered]
     │
     ▼
[Under Review] ──── Admin rejects ────► [Rejected]
     │                                      │
     │ Admin approves                       │ New accreditation request
     ▼                                      │
  [Regular] ◄───────────────────────────────┘
     │
     ├── Document expires ──────────────► [Pending]
     │                                      │
     ├── Admin suspends ──────────────► [Suspended]   Admin reactivates ─► [Regular]
     │
     └── (appears in marketplace)
```

---

## API Routes (Summary)

### Public
```
GET  /api/vendors              → list regular vendors
GET  /api/vendors/:id          → vendor detail + products
GET  /api/qrcode/:token        → QR code verification page
```

### Auth
```
POST /api/auth/register        → vendor registration
POST /api/auth/login           → login (vendor or admin)
POST /api/auth/refresh         → refresh JWT
```

### Vendor (requires JWT, role: vendor)
```
GET    /api/vendor/me                 → profile
PUT    /api/vendor/me                 → update profile
POST   /api/vendor/accreditation      → submit accreditation request
GET    /api/vendor/accreditation      → accreditation status
POST   /api/vendor/documents          → upload document
GET    /api/vendor/documents          → list documents
GET    /api/vendor/products           → list products
POST   /api/vendor/products           → create product
PUT    /api/vendor/products/:id       → update product
DELETE /api/vendor/products/:id       → delete product
PUT    /api/vendor/availability       → toggle availability
PUT    /api/vendor/location           → set sales point
```

### Admin (requires JWT, role: admin)
```
GET  /api/admin/dashboard                         → summary + alerts
GET  /api/admin/accreditations                    → list pending requests
PUT  /api/admin/accreditations/:id/approve        → approve vendor
PUT  /api/admin/accreditations/:id/reject         → reject vendor
PUT  /api/admin/vendors/:id/suspend               → suspend vendor
GET  /api/admin/documents/expiring                → documents expiring in 30 days
GET  /api/admin/sales-points                      → list sales points
POST /api/admin/sales-points                      → create sales point
PUT  /api/admin/sales-points/:id                  → update sales point
```

---

## Security

| Concern | Approach |
|---|---|
| Authentication | JWT (access + refresh tokens) |
| Password storage | bcrypt hashing |
| Authorization | RBAC middleware (vendor / admin / public) |
| File uploads | Type and size validation; stored outside web root |
| Public routes | No auth required; read-only access |
| HTTPS | Enforced in production |

---

## Scheduled Jobs

| Job | Trigger | Action |
|---|---|---|
| Document expiry check | Daily (cron) | Sets vendor status to `Pending` when a required document expires; deactivates QR code |
| Expiry alert | Daily (cron) | Generates alerts for documents expiring within 30 days |

---

## Tech Stack (Suggested)

| Layer | Technology |
|---|---|
| Frontend | React + React Router + Axios |
| Backend | Node.js + Express (or Python + FastAPI) |
| Database | PostgreSQL |
| ORM | Prisma (Node) or SQLAlchemy (Python) |
| Auth | JWT (jsonwebtoken / python-jose) |
| File storage | Local filesystem (MVP) → S3-compatible (production) |
| QR code | `qrcode` npm package or `qrcode` Python library |
| Scheduler | node-cron (Node) or APScheduler (Python) |
| Containerization | Docker + Docker Compose |

---

## Folder Structure (Backend — Node/Express example)

```
src/
├── config/          # Environment, DB connection
├── middlewares/     # Auth, RBAC, error handling
├── modules/
│   ├── auth/
│   ├── vendor/
│   ├── admin/
│   ├── marketplace/
│   ├── documents/
│   └── qrcode/
├── jobs/            # Scheduled tasks
├── utils/           # Helpers (hashing, QR gen, etc.)
└── app.js
```

---

## MVP Scope

The MVP focuses on the core accreditation + marketplace loop:

1. Vendor registers and submits accreditation request with documents
2. Admin reviews and approves / rejects
3. Approved vendor appears in the public marketplace
4. Students browse vendors, products, and locations
5. Document expiry automatically affects vendor status
6. QR code allows on-site regularization check

Post-MVP features (real-time notifications, campus map, chat, mobile app, admin reports) are out of scope for the initial release.

---

*UniEats — Universidade de Brasília (UnB) — Academic Project*
