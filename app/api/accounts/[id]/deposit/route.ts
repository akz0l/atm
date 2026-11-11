import { type AccountRouteContext, readJsonObject, respond } from "@/lib/api/response";
import { deposit } from "@/lib/services/transaction-service";

export async function POST(request: Request, { params }: AccountRouteContext) {
  return respond(async () => {
    const { id } = await params;
    const body = await readJsonObject(request);
    return deposit(id, body.amount);
  }, 201);
}
