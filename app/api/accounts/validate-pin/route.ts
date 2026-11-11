import { readJsonObject, requireString, respond } from "@/lib/api/response";
import { verifyPin } from "@/lib/services/account-service";

export async function POST(request: Request) {
  return respond(async () => {
    const body = await readJsonObject(request);
    return verifyPin(requireString(body, "accountId"), body.pin);
  });
}
