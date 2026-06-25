import { prisma } from "@/lib/prisma";

const SELECT_ADDRESS = {
  id: true,
  label: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
} as const;

export type AddressDto = {
  id: string;
  label: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string | null;
};

export type AddressWriteData = {
  label: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string | null;
};

export const addressRepository = {
  findByUser: (userId: string): Promise<AddressDto[]> =>
    prisma.address.findMany({
      where: { userId },
      select: SELECT_ADDRESS,
      orderBy: { createdAt: "desc" },
    }),

  /** Fetches a single address scoped to its owner (null if it isn't theirs). */
  findByIdForUser: (id: string, userId: string): Promise<AddressDto | null> =>
    prisma.address.findFirst({ where: { id, userId }, select: SELECT_ADDRESS }),

  create: (userId: string, data: AddressWriteData): Promise<AddressDto> =>
    prisma.address.create({ data: { userId, ...data }, select: SELECT_ADDRESS }),

  /** Updates an address scoped to its owner. Returns the number of rows touched. */
  update: (id: string, userId: string, data: AddressWriteData): Promise<number> =>
    prisma.address.updateMany({ where: { id, userId }, data }).then((r) => r.count),

  /** Deletes an address scoped to its owner. Returns the number of rows removed. */
  delete: (id: string, userId: string): Promise<number> =>
    prisma.address.deleteMany({ where: { id, userId } }).then((r) => r.count),
};
