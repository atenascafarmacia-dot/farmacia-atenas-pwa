import { type Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export type { Role };

const SELECT_USER = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
} as const;

export type UserDto = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: Role;
  createdAt: Date;
};

export type CreateUserData = {
  name: string;
  phone: string;
  email?: string;
  role?: Role;
};

export const userRepository = {
  findById: (id: string): Promise<UserDto | null> =>
    prisma.user.findUnique({ where: { id }, select: SELECT_USER }),

  findByEmail: (email: string): Promise<UserDto | null> =>
    prisma.user.findUnique({ where: { email }, select: SELECT_USER }),

  findByPhone: (phone: string): Promise<UserDto | null> =>
    prisma.user.findFirst({ where: { phone }, select: SELECT_USER }),

  create: (data: CreateUserData): Promise<UserDto> =>
    prisma.user.create({ data, select: SELECT_USER }),
};
