# TZW Fire Extinguisher Management System — Design Document (Activity 1)

## 1. Overview

TZW LTD's legacy Fire Extinguisher Management System was a **monolith**, which made it
hard to scale individual features, slowed releases, and created a single point of failure.
This document defines the **microservices architecture**, the **RESTful API contract**, and
the **database model** for the upgraded system, and describes the **user-registration mockup**.

The codebase in this repository is organised by domain (controllers / models / routes per
feature) so that each domain maps cleanly onto an independently deployable service. It can
run as a single process for development and be split into separate services for production
without rewriting business logic.

---

## 2. Microservices Breakdown

The system is decomposed into **five business microservices** behind an **API Gateway**,
each owning its own data and communicating over REST (and lightweight events for
notifications).

| # | Service | Responsibility | Core entities | Base route |
|---|---------|----------------|---------------|------------|
| 1 | **Auth / User Service** | Registration, login/logout, JWT issuing, role-based authorization, profile & password management (incl. reset) | `User` | `/api/auth` |
| 2 | **Extinguisher Service** | CRUD for fire extinguishers and their status | `Extinguisher` | `/api/extinguishers` |
| 3 | **Inspection Service** | Schedule inspections, assign inspectors, track status | `Inspection` | `/api/inspections` |
| 4 | **Maintenance Service** | Log maintenance actions, dates, and conditions noted | `Maintenance` | `/api/maintenance` |
| 5 | **Reporting Service** | Aggregate real-time reports (stock daily/monthly/yearly, inspection status) | reads from others | `/api/reports` |
| — | **Notification Service** (cross-cutting) | Send email notifications (inspection assignments, password resets) | — | internal (`utils/sendEmail`) |

### Architecture diagram (logical)

```
                         ┌──────────────────────────┐
                         │      React Frontend       │
                         │  (Vite SPA, JWT in store) │
                         └────────────┬──────────────┘
                                      │  HTTPS / REST
                         ┌────────────▼──────────────┐
                         │        API Gateway         │
                         │ routing • auth • CORS •    │
                         │ rate-limiting              │
                         └──┬───┬───┬───┬───┬─────────┘
            ┌───────────────┘   │   │   │   └───────────────┐
            ▼                   ▼   ▼   ▼                   ▼
     ┌────────────┐   ┌──────────────┐ ┌──────────────┐ ┌────────────┐
     │ Auth/User  │   │ Extinguisher │ │  Inspection  │ │ Maintenance│
     │  Service   │   │   Service    │ │   Service    │ │  Service   │
     └─────┬──────┘   └──────┬───────┘ └──────┬───────┘ └─────┬──────┘
           │                 │                │               │
        ┌──▼──┐           ┌──▼──┐          ┌──▼──┐         ┌──▼──┐
        │users│           │ ext │          │insp │         │maint│   (DB per service)
        └─────┘           └─────┘          └─────┘         └─────┘
                                      ▲
                         ┌────────────┴──────────────┐
                         │     Reporting Service      │
                         │ (aggregates read-only data)│
                         └────────────────────────────┘
                                      │
                         ┌────────────▼──────────────┐
                         │   Notification Service     │
                         │   (SMTP email via util)    │
                         └────────────────────────────┘
```

### Design principles applied
- **Single responsibility per service** — each owns one domain and its data.
- **Stateless services** — authentication via JWT, so any instance can serve any request
  (enables horizontal scaling and high availability).
- **Loose coupling** — services interact through well-defined REST contracts; notifications
  are fire-and-forget so a mail failure never blocks the core operation.
- **Independent scalability** — high-traffic services (e.g. Reporting) can be scaled
  separately from low-traffic ones.

### Current implementation note
For this submission the services run together as one Express process (a *modular monolith*),
but the folder layout (`controllers/`, `models/`, `routes/` per domain) means each can be
extracted into its own deployable service with its own database with minimal change. This is
the standard, low-risk migration path from monolith → microservices.

---

## 3. RESTful API Contract (OpenAPI / Swagger)

The full machine-readable contract is generated with **swagger-jsdoc** and served at:

```
http://localhost:5000/api-docs
```

### Summary of endpoints

**Auth / User Service** — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | public | Register a new user |
| POST | `/login` | public | Login, returns JWT |
| POST | `/logout` | bearer | Logout |
| POST | `/forgot-password` | public | Request a reset link by email |
| POST | `/reset-password/:token` | public | Reset password with a valid token |
| GET | `/profile` | bearer | Get current user profile |
| PUT | `/profile` | bearer | Update profile |
| PUT | `/change-password` | bearer | Change password |
| GET | `/users?role=` | bearer | List users (optionally by role) |

**Extinguisher Service** — `/api/extinguishers`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | bearer | List all extinguishers |
| POST | `/` | admin, inspector | Register extinguisher |
| GET | `/:id` | bearer | Get by ID |
| PUT | `/:id` | admin, inspector | Update |
| DELETE | `/:id` | admin | Remove |

**Inspection Service** — `/api/inspections`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | bearer | List inspections |
| POST | `/` | bearer | Schedule inspection (notifies inspector) |
| GET | `/:id` | bearer | Get by ID |
| PUT | `/:id` | admin, inspector | Update / mark completed |

**Maintenance Service** — `/api/maintenance`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | bearer | List maintenance logs |
| POST | `/` | admin, inspector | Log maintenance |
| GET | `/:id` | bearer | Get by ID |

**Reporting Service** — `/api/reports`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | admin | Real-time stock & inspection reports |

---

## 4. Database Model

The system uses **MongoDB** (one logical database per service in production). Entities and
relationships:

### Entity-Relationship diagram

```
┌─────────────────────────┐         ┌──────────────────────────┐
│          User           │         │       Extinguisher        │
├─────────────────────────┤         ├──────────────────────────┤
│ _id           ObjectId  │         │ _id            ObjectId   │
│ firstName     String    │         │ serialNumber   String (U) │
│ lastName      String    │         │ location       String     │
│ email         String (U)│         │ type           Enum       │
│ password      String(h) │         │ size           Enum       │
│ role          Enum      │         │ installationDate Date     │
│ resetPasswordToken      │         │ expiryDate     Date        │
│ resetPasswordExpires    │         │ status         Enum        │
│ timestamps              │         │ timestamps                 │
└───────┬─────────────────┘         └────────────┬──────────────┘
        │                                        │
        │ scheduledBy / inspector                │ extinguisher
        │ (1..*)                                 │ (1..*)
        ▼                                        ▼
┌─────────────────────────┐         ┌──────────────────────────┐
│       Inspection        │         │       Maintenance         │
├─────────────────────────┤         ├──────────────────────────┤
│ _id           ObjectId  │         │ _id            ObjectId   │
│ extinguisher  → Ext     │         │ extinguisher   → Ext      │
│ scheduledBy   → User    │         │ inspector      → User     │
│ inspector     → User    │         │ actionTaken    String     │
│ scheduledDate Date      │         │ dateOfAction   Date       │
│ status        Enum      │         │ conditionsNoted String    │
│ notes         String    │         │ timestamps                │
│ timestamps              │         └──────────────────────────┘
└─────────────────────────┘
(U) = unique   (h) = hashed (bcrypt)
```

### Relationships
- A **User** (inspector) can be assigned to many **Inspections** and author many **Maintenance** logs.
- An **Extinguisher** can have many **Inspections** and many **Maintenance** logs.
- **Inspection.scheduledBy** and **Inspection.inspector** both reference **User**.

### Enumerations
- `User.role`: `admin | inspector | user`
- `Extinguisher.type`: `Water | CO2 | Foam | Dry Chemical`
- `Extinguisher.size`: `2.5 lbs | 5 lbs | 9 lbs | 12 lbs`
- `Extinguisher.status`: `Active | Expired | Under Maintenance | Decommissioned`
- `Inspection.status`: `Scheduled | Completed | Cancelled`

---

## 5. User Roles & Authorization

| Role | Capabilities |
|------|--------------|
| **Admin** | Full access: manage users, all extinguisher CRUD (incl. delete), view reports |
| **Inspector** | Conduct inspections, log maintenance, register/update extinguishers, schedule inspections |
| **User** | View extinguisher status, schedule inspections |

Authorization is enforced by JWT middleware (`protect`) plus a role guard (`restrictTo(...)`).

---

## 6. User Registration / Signup Mockup

A dedicated mockup specification for the signup form lives in **`MOCKUP.md`**. The
implemented form (`frontend/src/pages/Register.jsx`) follows that spec: a split-screen
layout with branding on the left and the form (First Name, Last Name, Email, Password,
Account Type) on the right.
