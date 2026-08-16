/**
 * One-off: renames the ADMIN user identified by OPERATOR_PHONE to NEW_NAME.
 * Idempotent — safe to re-run. Usage: pnpm tsx scripts/rename-admin-user.ts
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const NEW_NAME = "Nelson";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const operatorPhone = process.env.OPERATOR_PHONE?.trim();
  if (!operatorPhone) {
    console.error("OPERATOR_PHONE no está definido en el entorno. Abortando.");
    process.exitCode = 1;
    return;
  }

  const admin = await db.user.findFirst({
    where: { phone: operatorPhone, role: "ADMIN" },
    select: { id: true, name: true, phone: true },
  });

  if (!admin) {
    console.error(`No existe un usuario ADMIN con teléfono ${operatorPhone}.`);
    process.exitCode = 1;
    return;
  }

  if (admin.name === NEW_NAME) {
    console.log(`El admin (${admin.phone}) ya se llama "${NEW_NAME}". Nada que hacer.`);
  } else {
    await db.user.update({ where: { id: admin.id }, data: { name: NEW_NAME } });
    console.log(`Admin ${admin.phone}: "${admin.name}" → "${NEW_NAME}".`);
  }

  const remaining = await db.user.findMany({
    where: { name: { contains: "Pablo", mode: "insensitive" } },
    select: { id: true, name: true, phone: true, role: true },
  });
  if (remaining.length > 0) {
    console.log("Otros usuarios llamados Pablo (sin modificar):");
    for (const u of remaining) {
      console.log(`  - ${u.name} (${u.role}, ${u.phone})`);
    }
  } else {
    console.log("No quedan usuarios llamados Pablo.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
