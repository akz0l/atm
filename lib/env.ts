/**
 * Connection string for the local Docker Compose database.
 * Keeps `docker compose up -d && npm install && npx prisma migrate dev` working
 * without a `.env` file; any DATABASE_URL in the environment takes precedence.
 */
const LOCAL_DATABASE_URL = "postgresql://atm:atm@localhost:5432/atm_simulator";

export function getDatabaseUrl(): string {
  return process.env.DATABASE_URL || LOCAL_DATABASE_URL;
}
