import { connection } from "next/server";
import { AtmTerminal } from "@/components/atm/atm-terminal";
import { listAccounts } from "@/lib/services/account-service";

export default async function HomePage() {
  // Read the cards at request time: the database is not available during `next build`.
  await connection();
  const accounts = await listAccounts();

  return <AtmTerminal accounts={accounts} />;
}
