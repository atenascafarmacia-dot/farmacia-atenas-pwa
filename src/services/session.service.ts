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
 * Whether the given user can access the operator area. Access is granted to any
 * non-customer role (ADMIN or FARMACEUTICO). Roles are assigned in the DB; the
 * `OPERATOR_PHONE` env var only bootstraps the first operator at identify time
 * (see {@link findOrCreateUser}).
 */
export function isOperator(user: UserDto | null): boolean {
  if (!user) return false;
  return user.role !== "CLIENTE";
}

/**
 * Whether the current session belongs to an operator. Server actions are
 * directly invocable, so writes guarded only by route layout must re-check this.
 */
export async function isCurrentUserOperator(): Promise<boolean> {
  return isOperator(await getCurrentUser());
}

/** Whether the phone matches the configured operator-bootstrap number. */
function isBootstrapOperatorPhone(phone: string): boolean {
  const operatorPhone = process.env.OPERATOR_PHONE?.trim();
  return Boolean(operatorPhone) && phone.trim() === operatorPhone;
}

export async function findOrCreateUser(
  name: string,
  phone: string,
): Promise<UserDto> {
  const existing = await userRepository.findByPhone(phone);
  if (existing) return existing;
  // Bootstrap: the configured operator phone is created with the ADMIN role so
  // the operator area is reachable without manual DB edits.
  const role = isBootstrapOperatorPhone(phone) ? "ADMIN" : "CLIENTE";
  return userRepository.create({ name, phone, role });
}
