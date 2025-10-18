## Quick Start

### Prerequisites

- `pnpm` installed
- Docker (including Docker Compose) installed and running. Note: setup is using `docker compose` syntax

### Setup

```bash
./scripts/setup-local.sh
```

This will copy .env.example to .env, install dependencies, and perform database migrations, by starting Postgres container and running migrations. Then it will shut down the container.

After the script is completed, you can run containers and app:

```bash
docker compose up -d

pnpm dev
# Optionally (install pino-pretty globally first: `npm i -g pino-pretty`)
pnpm dev | pino-pretty
```

## Local Development

### Using docker

You can run the app using docker and docker compose in both development mode (with hot reload) or in release mode, which is production-like build, with automated DB and migrations for easier testing.

To run dev mode: `pnpm docker:dev`.

For development mode, you need to manually migrate DB schema. `cp .env.example .env && pnpm db:migrate`. You can also use `db:push` to avoid migrations while prototyping.

To run in release mode: `pnpm docker:release`
For release DB migrations runs automatically via docker compose. You don't need to do anything more.

Eventually you can run docker commands manually

Please note that we use `docker compose` syntax. If you support only `docker-compose`, reuse commands from `package.json` in CLI.

Please note that dev and release databases are using different volumes!

## TODOs

- [ ] Remove unused files and test files from production builds

### Manual

1. Run databases using docker-compose
2. Push DB changes using `pnpm db:migrate`
3. (Optionally) Seed the data using `pnpm db:seed`

## Testing

App has 2 types of tests: unit and integration tests

Unit tests are always placed next to the tested files, while integration tests are placed in the `tests/integration` directory.

Please follow the file naming convention:

- **Unit tests**: <tested file name>.unit.test.ts
- **Integration tests**: <name>.integration.test.ts
  - Pick an appropriate name based on what you're testing.

### Running tests

- **Unit tests**: `pnpm test` or `pnpm test:unit`
- **Integration tests**: `pnpm test:integration`
  - For integration tests you **need** to have Docker up and running. Integration tests are using [testcontainers](https://testcontainers.com/) to run required dependencies. Read more about the choice below.

### Testcontainers

I decided to go with the testcontainers approach because I had some good memories with it. I considered a few other approaches:

- **Mocking db for integrations tests**: Decided on this approach only for unit tests. Full mocking in integration tests is not the best idea in my opinion. But I believe it's the right way for unit tests.
- **In memory postgres**: There's an approach to use in-memory PostgreSQL using `@electric-sql/pglite`, by doing a small hack in the test setup. This is a fast solution that allows using PostgreSQL without Docker overhead. But based on my experience, the possible compatibility issues with in-memory PostgreSQL might get problematic in the future. I decided that for this project I will continue with testcontainers even though they are a bit slower. Still, containers run only for integration tests which should be run less often.
- **Using single DB for all tests**: This is an approach that generally works fine, but it introduces a problem of tests affecting each other, which is not good for integration tests. We could mitigate it in some ways, like using prefixes and other techniques, but I personally don't like this approach, especially when testcontainers are available.

### Note about testing

I know there are different definitions of testing types, which may create some misunderstanding, etc. In my personal philosophy, unit tests are testing a single thing, and the smallest possible thing without any external services/dependencies, thus I'm against using real/in-memory databases and external things in unit tests. Though I will just say that I totally understand other approaches, and I can adjust and be flexible here ;)

## Notes

### Hono

Recently I'm a big fan of [Elysia](https://elysiajs.com/) (You can see my Elysia inspiration in repo structure), but since exercise is about Node.js I picked Hono framework. It's my current number 2 :D. Hono recently gained some popularity, and while I worked a lot with Express, and it still has better ecosystem, Hono also has some nice libraries and helpers, and it's simple to use, with similar stuff as Express. I didn't want to use NestJS, I'm not a big fan, but it would be too long to write about it 😅.

### Drizzle

Drizzle is currently very popular, so this choice should no longer be a surprise. I'm not sure what's the current state of Prisma. I know they work a lot and do some good stuff. Plus DX is awesome, but I had some bad experience with speed, especially compared with Drizzle. Apart from Drizzle I also really like [kysely](https://kysely.dev/).

### Zod

Honestly I wouldn't choose Zod if not the ecosystem, and swagger/openapi. I prefer [valibot](https://valibot.dev/) right now, and I'm also following [ArkType](https://arktype.io/).

### Cache

I picked suggested LRU cache, but I added p-memoize to it, to handle promises better. This prevents additional DB calls while first one is in progress etc. I decided to go for DB cache rather than full requests, not sure about exact requirement in task, but the logic will be similar anyways, just place would be different (maybe a middleware to cache get requests globally).

# Server-node Exercise

This exercise is designed to demonstrate and display proficiency in **Node.js** and **RESTful API design**.  
The tasks range from straightforward to intermediate and potentially challenging features.

---

## Requirements

### Domain Model

The service must manage and persist a simple domain of three entities: **Users**, **Organizations**, and **Orders**.

- **User**: `id`, `firstName`, `lastName`, `email`, `organizationId`, `dateCreated`
- **Organization**: `id`, `name`, `industry`, `dateFounded`
- **Order**: `id`, `orderDate`, `totalAmount`, `userId`, `organizationId`

> The `userId` and `organizationId` values must reference valid records.

---

### RESTful Endpoints

Each entity must support the following endpoints:

| Method | Route                | Description                   |
| ------ | -------------------- | ----------------------------- |
| GET    | `/api/[entity]`      | Returns all items (paginated) |
| GET    | `/api/[entity]/{id}` | Returns a single item by ID   |
| POST   | `/api/[entity]`      | Creates a new item            |
| PUT    | `/api/[entity]/{id}` | Updates an existing item      |
| DELETE | `/api/[entity]/{id}` | Deletes an item               |

#### Special endpoint

- `GET /api/orders/{id}` — returns the order **along with** the associated user and organization.

---

### Input Validation

`POST` and `PUT` requests must be validated and respond with appropriate HTTP status codes.

| Rule                         | Description                                 |
| ---------------------------- | ------------------------------------------- |
| User `firstName`, `lastName` | Must not be null or whitespace              |
| Organization `name`          | Must not be null or whitespace              |
| Order `totalAmount`          | Must be **greater than 0**                  |
| All date fields              | Must occur **before** the current timestamp |

---

### API Documentation and Health Checks

- **Swagger/OpenAPI** must be available at: `GET /swagger`
- Health probes:
  - `GET /health` — liveness
  - `GET /readiness` — readiness (check DB connection and cache readiness)

---

## Seed Data

Provide a simple seed script that creates:

- 2 organizations
- 10 users
- 20 orders (with valid past dates)

This will help with testing pagination, relationships, and validation rules.

---

## Non-functional Requirements

1. Use preferred ORM for database interactions.
2. Separate concerns between:
   - Controllers
   - Business logic (services)
   - Data access (repositories)
3. Domain entities **must not** be directly exposed in HTTP responses.  
   Use DTOs or mapping functions.
4. Logging:
   - Database state changes → `info` level
   - HTTP headers → `debug` level
5. Implement **unit tests** for business logic.
6. Deploy the service via **Docker**, including dependencies
7. Handle unhandled exceptions gracefully — return a structured JSON error message, not the developer exception page.

---

### Bonus Features

1. **Client-side caching headers**
   - User and Organization responses: cacheable for **10 minutes**
   - Order responses: use **ETag** headers (`304 Not Modified` when valid)
2. **Server-side caching**
   - Cache GET responses in memory (e.g., using `lru-cache`)
   - TTL: **10 minutes**
   - Invalidate cached entries when related data changes
3. **Rate limiting**
   - Limit API access per organization to **30 requests per minute**
4. **Authentication**
   - Implement **JWT/OAuth2** authentication
   - All routes require authorization except `/health`, `/readiness`, and `/swagger`
5. **Secure configuration**
   - No hardcoded credentials in the source code (implement industry recognized security standards)

---

## Deliverables

The final repository must include:

- Complete source code
- `README.md` (this file)
- `docker-compose.yml`
- `Dockerfile`
- `.env.example`
- Swagger documentation setup
- Unit tests

### The `README.md` must describe:

- How to run the app locally
- How to run it with Docker
- How to access the Swagger UI
- How to run the test suite
- A short note on key design decisions (ORM, error handling, caching, etc.)

---
