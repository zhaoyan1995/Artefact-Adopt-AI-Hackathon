#  Hackathon Starter Kit

A lightweight full-stack starter kit designed for rapid prototyping and collaborative hackathon development.

Built with React, NestJS, PostgreSQL and Prisma in a pnpm Monorepo.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Infrastructure | Docker Compose |
| Package Manager | pnpm |
| Architecture | Monorepo |

## 2. Architecture Overview

```mermaid
flowchart TD
    User["User / Browser"]

    subgraph Frontend
        React["React + TypeScript<br/>Vite :5173"]
    end

    subgraph Backend
        Nest["NestJS API :4000"]
        Controller["Controllers"]
        Service["Services"]
        Prisma["Prisma Client"]
    end

    subgraph Infrastructure
        DB["PostgreSQL<br/>Docker :5432"]
    end

    User --> React
    React -->|"/api/*"| ViteProxy["Vite Proxy"]
    ViteProxy --> Nest
    Nest --> Controller
    Controller --> Service
    Service --> Prisma
    Prisma --> DB
    DB --> Prisma
    Prisma --> Service
    Service --> Controller
    Controller --> Nest
    Nest --> React
```

### Request Flow

1. The browser sends API requests to the frontend.
2. Vite Proxy forwards `/api/*` requests to NestJS.
3. NestJS Controllers receive HTTP requests.
4. Services handle business logic.
5. Prisma communicates with PostgreSQL.
6. The backend returns JSON responses to the frontend.

**Development ports:**

| Service | Port | URL |
|---|---:|---|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 4000 | http://localhost:4000 |
| PostgreSQL | 5432 | localhost:5432 |

## 3. Project Structure

```text
hackathon_11_26/
├── apps/
│   ├── frontend/                 # React + Vite
│   └── backend/                  # NestJS API
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── src/
│       │   ├── database/         # Prisma service
│       │   └── modules/
│       │       ├── health/
│       │       └── users/
│       └── prisma7.config.ts
│
├── infrastructure/
│   └── compose.yaml              # PostgreSQL
│
├── packages/                    # Shared packages
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

## 4. Prerequisites

Install the following tools before starting:

- Node.js (v22 or later)
- pnpm
- Docker Engine
- Docker Compose

Check your installation:

```bash
node -v
pnpm -v
docker -v
docker compose version
```

## 5. Team Setup — First-Time Installation

Follow these steps when joining the project for the first time.

### Step 1 — Clone the Repository

```bash
git clone <repository-url>
cd hackathon_11_26
```

### Step 2 — Install Dependencies

```bash
pnpm install --frozen-lockfile
```

This installs dependencies for all workspace packages.

### Step 3 — Configure Environment Variables

Create your local environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure your local database credentials.

Example:

```env
# Backend
PORT=4000

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=hackathon_dev_password
POSTGRES_DB=hackathon

# Prisma
DATABASE_URL="postgresql://postgres:hackathon_dev_password@localhost:5432/hackathon?schema=public"
```

Important:

- `.env` contains local configuration and must never be committed.
- `DATABASE_URL` credentials must match the PostgreSQL credentials.
- If your password contains special characters, URL-encode them in `DATABASE_URL`.
- Each developer should use their own local `.env`.

### Step 4 — Start PostgreSQL

From the project root:

```bash
docker compose --env-file .env -f infrastructure/compose.yaml up -d
```

Check database status:

```bash
docker compose --env-file .env -f infrastructure/compose.yaml ps
```

Wait until PostgreSQL reports `healthy`.

### Step 5 — Apply Database Migrations

Initialize your local database using the migrations committed to Git:

```bash
pnpm --filter backend exec prisma migrate dev
```

Generate the Prisma Client:

```bash
pnpm --filter backend exec prisma generate
```

Your local database should now match the project schema.

### Step 6 — Start Frontend and Backend

From the project root:

```bash
pnpm dev
```

This starts both development servers.

Open:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health Check: http://localhost:4000/api/health

## 6. Collaborative Development Workflow

Once everyone has completed the initial setup, follow this workflow during the hackathon.

### Phase 1 — Agree on the Requirements

Before coding, the team should agree on:

- Core features and priorities.
- Database entities and relationships.
- API endpoints and request/response formats.
- Frontend pages and components.
- Task ownership.

Avoid having multiple developers modify the same files simultaneously.

### Phase 2 — Divide Development Tasks

A suggested division:

| Role | Responsibilities |
|---|---|
| Frontend | Pages, components, UI, API integration |
| Backend | Controllers, services, business logic |
| Database | Prisma schema, migrations, data models |
| Integration | API contracts, testing, integration |

For a small team, one person can handle multiple responsibilities.

**Important:** Frontend and backend developers should agree on API contracts before implementing their respective features.

This allows frontend development to proceed using mock data while backend endpoints are being implemented.

### Phase 3 — Database Changes

When a developer needs to modify the database:

1. Update `schema.prisma`.
2. Generate a migration:

```bash
pnpm --filter backend exec prisma migrate dev --name describe_change
```

3. Generate the Prisma Client if needed:

```bash
pnpm --filter backend exec prisma generate
```

4. Commit both the updated schema and the migration files.

Other team members should pull the changes and apply pending migrations locally:

```bash
pnpm --filter backend exec prisma migrate dev
```

**Important database collaboration rules:**

- Commit migration files to Git.
- Do not commit local database data or Docker volumes.
- Coordinate schema changes to avoid conflicting migrations.
- Never modify an already-shared migration just to rewrite history.

### Phase 4 — Git Collaboration

Create a feature branch before starting a task:

```bash
git checkout -b feature/your-feature
```

After development:

```bash
git add .
git commit -m "feat: implement your feature"
git push -u origin feature/your-feature
```

Create a Pull Request and integrate changes into `main`.

Before starting another task:

```bash
git checkout main
git pull origin main
```

### Phase 5 — Integration and Testing

Before merging or presenting a feature:

- Verify frontend behavior.
- Verify backend API responses.
- Verify database operations.
- Check browser console and backend logs.
- Test the complete frontend-to-database flow.

Keep the application runnable throughout development.

## 7. Available API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Backend and database health check |
| POST | `/api/users` | Create a user |

### Health Check

```bash
curl http://localhost:4000/api/health
```

### Create User

```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice"}'
```

Example response:

```json
{
  "id": 1,
  "email": "alice@example.com",
  "name": "Alice"
}
```

## 8. Useful Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start frontend and backend |
| `pnpm install --frozen-lockfile` | Install workspace dependencies |
| `pnpm --filter backend exec prisma generate` | Generate Prisma Client |
| `pnpm --filter backend exec prisma migrate dev` | Apply development migrations |
| `pnpm --filter backend exec prisma studio` | Open Prisma Studio |
| `docker compose --env-file .env -f infrastructure/compose.yaml ps` | Check database status |
| `docker compose --env-file .env -f infrastructure/compose.yaml down` | Stop database container |

**Note:** `docker compose down` preserves the database volume. Avoid `down -v` unless you intentionally want to delete local database data.

## 9. Development Notes

- Frontend API requests should use `/api` as their base path.
- Vite Proxy forwards `/api` requests to the backend during development.
- Backend port is configured through the root `.env`.
- PostgreSQL runs in Docker; backend connects through `localhost:5432`.
- Prisma schema and migration history are version-controlled.
- `.env`, `node_modules/`, build outputs and local database data must be excluded from Git.
- Shared code can be organized inside `packages/`.

---

**Goal: Keep the setup simple, the architecture clear, and the team focused on building the product.**