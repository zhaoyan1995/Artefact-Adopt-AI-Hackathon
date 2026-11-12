# Hackathon Starter Kit

A lightweight full-stack starter kit for rapid hackathon development.

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | NestJS, TypeScript |
| Package Manager | pnpm |
| Architecture | Monorepo |

## 2. Project Structure

```text
hackathon_11_26/
├── apps/
│   ├── frontend/       # React + Vite
│   └── backend/        # NestJS API
├── infra/              # Infrastructure configuration
├── packages/           # Shared packages
├── package.json
├── pnpm-workspace.yaml
└── .gitignore
```

## 3. Prerequisites

Make sure you have installed:

- Node.js
- pnpm

Check your versions:

```bash
node -v
pnpm -v
```

## 4. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd hackathon_11_26
pnpm install
```

## 5. Environment Configuration

Create the backend environment file:

```bash
touch apps/backend/.env
```

Add the following configuration:

```env
PORT=4000
```

## 6. Start Development Servers

Start both frontend and backend from the project root:

```bash
pnpm dev
```

Default development URLs:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:4000 |
| Health Check | http://localhost:4000/api/health |

## 7. Health Check

The backend provides a health-check endpoint:

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "hackathon-backend"
}
```

You can test it with:

```bash
curl http://localhost:4000/api/health
```

## 8. Development Notes

- Frontend API requests use `/api` as their base path.
- Vite Proxy forwards `/api` requests to the backend.
- Backend port is configured through `apps/backend/.env`.
- Environment files and local dependencies are excluded from Git.
- Shared code can be organized inside `packages/`.
