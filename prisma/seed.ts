import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "../src/generated/prisma/client";
import { OrderStatus } from "../src/generated/prisma/enums";

const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const url = rawUrl.replace(/^file:/, "");
const adapter = new PrismaBetterSqlite3({ url });
const db = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const products = await Promise.all([
    db.product.create({
      data: {
        name: "Paracetamol 500mg x20",
        description: "Analgésico y antipirético. Alivia el dolor leve a moderado y reduce la fiebre.",
        price: 3.5,
        stock: 150,
        category: "Analgésicos",
        requiresPrescription: false,
      },
    }),
    db.product.create({
      data: {
        name: "Ibuprofeno 400mg x20",
        description: "Antiinflamatorio no esteroideo. Alivia dolor, fiebre e inflamación.",
        price: 4.2,
        stock: 120,
        category: "Antiinflamatorios",
        requiresPrescription: false,
      },
    }),
    db.product.create({
      data: {
        name: "Amoxicilina 500mg x14",
        description: "Antibiótico de amplio espectro para infecciones bacterianas.",
        price: 8.9,
        stock: 80,
        category: "Antibióticos",
        requiresPrescription: true,
      },
    }),
    db.product.create({
      data: {
        name: "Omeprazol 20mg x28",
        description: "Inhibidor de bomba de protones. Trata acidez, úlceras y reflujo gástrico.",
        price: 5.6,
        stock: 100,
        category: "Gástricos",
        requiresPrescription: false,
      },
    }),
    db.product.create({
      data: {
        name: "Loratadina 10mg x10",
        description: "Antihistamínico de segunda generación. Alivia síntomas de alergia sin somnolencia.",
        price: 3.8,
        stock: 90,
        category: "Antialérgicos",
        requiresPrescription: false,
      },
    }),
    db.product.create({
      data: {
        name: "Vitamina C 1000mg x30",
        description: "Suplemento de ácido ascórbico. Refuerza el sistema inmune y actúa como antioxidante.",
        price: 6.4,
        stock: 200,
        category: "Suplementos",
        requiresPrescription: false,
      },
    }),
    db.product.create({
      data: {
        name: "Aspirina 100mg x20",
        description: "Antiagregante plaquetario. Previene eventos cardiovasculares en dosis bajas.",
        price: 2.9,
        stock: 130,
        category: "Cardiovascular",
        requiresPrescription: false,
      },
    }),
    db.product.create({
      data: {
        name: "Metformina 850mg x30",
        description: "Antidiabético oral. Controla los niveles de glucosa en diabetes tipo 2.",
        price: 7.2,
        stock: 60,
        category: "Diabetes",
        requiresPrescription: true,
      },
    }),
    db.product.create({
      data: {
        name: "Atorvastatina 20mg x30",
        description: "Estatina para reducir el colesterol LDL y prevenir enfermedad cardiovascular.",
        price: 12.5,
        stock: 50,
        category: "Cardiovascular",
        requiresPrescription: true,
      },
    }),
    db.product.create({
      data: {
        name: "Salbutamol 100mcg Inhalador",
        description: "Broncodilatador de acción rápida. Alivia el broncoespasmo en asma y EPOC.",
        price: 14.8,
        stock: 40,
        category: "Inhaladores",
        requiresPrescription: true,
      },
    }),
    db.product.create({
      data: {
        name: "Alcohol Isopropílico 70% 500ml",
        description: "Antiséptico tópico. Desinfección de piel y superficies.",
        price: 3.2,
        stock: 180,
        category: "Antisépticos",
        requiresPrescription: false,
      },
    }),
    db.product.create({
      data: {
        name: "Jeringas Descartables 5ml x10",
        description: "Jeringas estériles de un solo uso con aguja 21G incluida.",
        price: 4.5,
        stock: 75,
        category: "Material médico",
        requiresPrescription: false,
      },
    }),
  ]);

  console.log(`Created ${products.length} products.`);

  const user = await db.user.create({
    data: {
      name: "José Antonio García",
      email: "jose.antonio@example.com",
      phone: "+503 7890-1234",
    },
  });

  console.log(`Created user: ${user.email}`);

  const paracetamol = products[0];
  const ibuprofeno = products[1];
  const loratadina = products[4];
  const vitaminaC = products[5];

  if (!paracetamol || !ibuprofeno || !loratadina || !vitaminaC) {
    throw new Error("Products were not created correctly");
  }

  const order1 = await db.order.create({
    data: {
      code: "FAR-2024-001",
      userId: user.id,
      status: OrderStatus.COMPLETADA,
      total: paracetamol.price * 2 + vitaminaC.price,
      items: {
        create: [
          { productId: paracetamol.id, quantity: 2, unitPrice: paracetamol.price },
          { productId: vitaminaC.id, quantity: 1, unitPrice: vitaminaC.price },
        ],
      },
    },
  });

  const order2 = await db.order.create({
    data: {
      code: "FAR-2024-002",
      userId: user.id,
      status: OrderStatus.PENDIENTE,
      total: ibuprofeno.price + loratadina.price * 2,
      items: {
        create: [
          { productId: ibuprofeno.id, quantity: 1, unitPrice: ibuprofeno.price },
          { productId: loratadina.id, quantity: 2, unitPrice: loratadina.price },
        ],
      },
    },
  });

  console.log(`Created orders: ${order1.code} (${order1.status}), ${order2.code} (${order2.status})`);
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
