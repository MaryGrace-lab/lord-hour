"use server";

import { checkLoginRateLimit } from "@/lib/login-security";
import { getClientIp } from "@/lib/ip";

export async function precheckLoginRateLimit(username: string) {
  const ip = await getClientIp();
  return checkLoginRateLimit(username.toLowerCase().trim(), ip);
}