"use server";

import { redirect } from "next/navigation";

import { clearSession } from "@/services/session.service";

/** Clears the session cookie and sends the user back to identify. */
export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/");
}
