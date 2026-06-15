import { cookies } from "next/headers";

import { type UserDto,userRepository } from "@/repositories/user.repo";

const COOKIE_NAME = "pharmacy-session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getCurrentUser(): Promise<UserDto | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;
  if (!userId) return null;
  return userRepository.findById(userId);
}

export async function setSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Whether the given user is the configured operator. The operator is matched
 * by phone against the build-time `OPERATOR_PHONE` env var. Returns false when
 * the var is unset, so the operator view stays closed by default.
 */
export function isOperator(user: UserDto | null): boolean {
  const operatorPhone = process.env.OPERATOR_PHONE?.trim();
  if (!operatorPhone || !user) return false;
  return user.phone.trim() === operatorPhone;
}

export async function findOrCreateUser(
  name: string,
  phone: string,
): Promise<UserDto> {
  const existing = await userRepository.findByPhone(phone);
  if (existing) return existing;
  return userRepository.create({ name, phone });
}
