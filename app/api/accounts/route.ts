import { respond } from "@/lib/api/response";
import { listAccounts } from "@/lib/services/account-service";

export async function GET() {
  return respond(() => listAccounts());
}
