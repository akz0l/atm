import { type AccountRouteContext, respond } from "@/lib/api/response";
import { getBalance } from "@/lib/services/account-service";

export async function GET(_request: Request, { params }: AccountRouteContext) {
  return respond(async () => {
    const { id } = await params;
    return getBalance(id);
  });
}
