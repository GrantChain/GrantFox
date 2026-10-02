import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export interface AuthUser {
  id: string;
  address: string;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const walletAddress = req.headers.get("x-wallet-address") || req.headers.get("authorization")?.replace("Bearer ", "") || "";

  if (!walletAddress) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { address: walletAddress.toLowerCase() },
    select: { id: true, address: true },
  });

  if (!user) {
    return null;
  }

  return user;
}

export function requireAuth(req: NextRequest): Promise<{ user: AuthUser; req: NextRequest }> {
  return new Promise((resolve, reject) => {
    getAuthUser(req).then((user) => {
      if (!user) {
        reject(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
        return;
      }
      resolve({ user, req });
    }).catch(reject);
  });
}
