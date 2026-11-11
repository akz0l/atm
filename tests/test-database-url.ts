import "dotenv/config";

/** Integration tests run against their own database so they never touch demo data. */
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "postgresql://atm:atm@localhost:5432/atm_simulator_test";
