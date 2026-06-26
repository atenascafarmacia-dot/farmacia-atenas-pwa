import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import {
  DeliveryMethod,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
} from "../src/generated/prisma/enums";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

/** Adds `days` to a base date; used to spread example expiration dates. */
function inDays(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log("Seeding database...");

  const categoryNames = [
    "Analgésicos",
    "Antiinflamatorios",
    "Antibióticos",
    "Gástricos",
    "Antialérgicos",
    "Suplementos",
    "Cardiovascular",
    "Diabetes",
    "Inhaladores",
    "Antisépticos",
    "Material médico",
  ];

  const categories = await Promise.all(
    categoryNames.map((name) => db.category.create({ data: { name } })),
  );
  const categoryId = (name: string): string => {
    const category = categories.find((c) => c.name === name);
    if (!category) throw new Error(`Category not found: ${name}`);
    return category.id;
  };

  console.log(`Created ${categories.length} categories.`);

  const seedProducts: Array<{
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    requiresPrescription: boolean;
    expirationDate: Date;
    lotNumber: string;
  }> = [
    {
      name: "Paracetamol 500mg x20",
      description: "Analgésico y antipirético. Alivia el dolor leve a moderado y reduce la fiebre.",
      price: 3.5,
      stock: 150,
      category: "Analgésicos",
      requiresPrescription: false,
      expirationDate: inDays(540),
      lotNumber: "PARA-2026-A",
    },
    {
      name: "Ibuprofeno 400mg x20",
      description: "Antiinflamatorio no esteroideo. Alivia dolor, fiebre e inflamación.",
      price: 4.2,
      stock: 120,
      category: "Antiinflamatorios",
      requiresPrescription: false,
      expirationDate: inDays(480),
      lotNumber: "IBU-2026-A",
    },
    {
      name: "Amoxicilina 500mg x14",
      description: "Antibiótico de amplio espectro para infecciones bacterianas.",
      price: 8.9,
      stock: 80,
      category: "Antibióticos",
      requiresPrescription: true,
      expirationDate: inDays(300),
      lotNumber: "AMOX-2026-A",
    },
    {
      name: "Omeprazol 20mg x28",
      description: "Inhibidor de bomba de protones. Trata acidez, úlceras y reflujo gástrico.",
      price: 5.6,
      stock: 100,
      category: "Gástricos",
      requiresPrescription: false,
      expirationDate: inDays(420),
      lotNumber: "OME-2026-A",
    },
    {
      name: "Loratadina 10mg x10",
      description: "Antihistamínico de segunda generación. Alivia síntomas de alergia sin somnolencia.",
      price: 3.8,
      stock: 90,
      category: "Antialérgicos",
      requiresPrescription: false,
      expirationDate: inDays(600),
      lotNumber: "LORA-2026-A",
    },
    {
      name: "Vitamina C 1000mg x30",
      description: "Suplemento de ácido ascórbico. Refuerza el sistema inmune y actúa como antioxidante.",
      price: 6.4,
      stock: 200,
      category: "Suplementos",
      requiresPrescription: false,
      expirationDate: inDays(720),
      lotNumber: "VITC-2026-A",
    },
    {
      name: "Aspirina 100mg x20",
      description: "Antiagregante plaquetario. Previene eventos cardiovasculares en dosis bajas.",
      price: 2.9,
      stock: 130,
      category: "Cardiovascular",
      requiresPrescription: false,
      expirationDate: inDays(500),
      lotNumber: "ASP-2026-A",
    },
    {
      name: "Metformina 850mg x30",
      description: "Antidiabético oral. Controla los niveles de glucosa en diabetes tipo 2.",
      price: 7.2,
      stock: 60,
      category: "Diabetes",
      requiresPrescription: true,
      expirationDate: inDays(360),
      lotNumber: "MET-2026-A",
    },
    {
      name: "Atorvastatina 20mg x30",
      description: "Estatina para reducir el colesterol LDL y prevenir enfermedad cardiovascular.",
      price: 12.5,
      stock: 50,
      category: "Cardiovascular",
      requiresPrescription: true,
      expirationDate: inDays(400),
      lotNumber: "ATOR-2026-A",
    },
    {
      name: "Salbutamol 100mcg Inhalador",
      description: "Broncodilatador de acción rápida. Alivia el broncoespasmo en asma y EPOC.",
      price: 14.8,
      stock: 40,
      category: "Inhaladores",
      requiresPrescription: true,
      expirationDate: inDays(330),
      lotNumber: "SALB-2026-A",
    },
    {
      name: "Alcohol Isopropílico 70% 500ml",
      description: "Antiséptico tópico. Desinfección de piel y superficies.",
      price: 3.2,
      stock: 180,
      category: "Antisépticos",
      requiresPrescription: false,
      expirationDate: inDays(900),
      lotNumber: "ALC-2026-A",
    },
    {
      name: "Jeringas Descartables 5ml x10",
      description: "Jeringas estériles de un solo uso con aguja 21G incluida.",
      price: 4.5,
      stock: 75,
      category: "Material médico",
      requiresPrescription: false,
      expirationDate: inDays(1000),
      lotNumber: "JER-2026-A",
    },
  ];

  const products = await Promise.all(
    seedProducts.map((p) =>
      db.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          categoryId: categoryId(p.category),
          requiresPrescription: p.requiresPrescription,
          expirationDate: p.expirationDate,
          batches: {
            create: [{ lotNumber: p.lotNumber, expiresAt: p.expirationDate, stock: p.stock }],
          },
        },
      }),
    ),
  );

  console.log(`Created ${products.length} products (with one batch each).`);

  // Operator/admin bootstrap: the seed user is promoted to ADMIN so the
  // operator area is reachable out of the box.
  const user = await db.user.create({
    data: {
      name: "José Antonio García",
      email: "jose.antonio@example.com",
      phone: "+584121234567",
      role: Role.ADMIN,
      addresses: {
        create: [
          {
            label: "Casa",
            address: "Av. Libertador, Edif. Atenas, Apto 4B",
            city: "Caracas",
            state: "Distrito Capital",
            zipCode: "1050",
          },
        ],
      },
    },
  });

  console.log(`Created user: ${user.email} (${user.role})`);

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
      deliveryMethod: DeliveryMethod.RETIRO_TIENDA,
      paymentMethod: PaymentMethod.EFECTIVO,
      paymentStatus: PaymentStatus.PAGADO,
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
      deliveryMethod: DeliveryMethod.ENVIO_DOMICILIO,
      paymentMethod: PaymentMethod.PAGO_MOVIL,
      paymentStatus: PaymentStatus.PENDIENTE,
      notes: "Dejar con el conserje si no estoy.",
      shippingAddress: "Av. Libertador, Edif. Atenas, Apto 4B",
      shippingCity: "Caracas",
      shippingState: "Distrito Capital",
      shippingZip: "1050",
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
