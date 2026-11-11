import { type AccountRouteContext, respond } from "@/lib/api/response";
import { listTransactions } from "@/lib/services/transaction-service";

export async function GET(_request: Request, { params }: AccountRouteContext) {
  return respond(async () => {
    const { id } = await params;
    return listTransactions(id);
  });
}
