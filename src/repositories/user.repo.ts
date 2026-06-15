import { prisma } from "@/lib/prisma";

const SELECT_USER = {
  id: true,
  name: true,
  email: true,
  phone: true,
  createdAt: true,
} as const;

export type UserDto = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
};

export type CreateUserData = {
  name: string;
  email: string;
  phone?: string;
};

export const userRepository = {
  findById: (id: string): Promise<UserDto | null> =>
    prisma.user.findUnique({ where: { id }, select: SELECT_USER }),

  findByEmail: (email: string): Promise<UserDto | null> =>
    prisma.user.findUnique({ where: { email }, select: SELECT_USER }),

  create: (data: CreateUserData): Promise<UserDto> =>
    prisma.user.create({ data, select: SELECT_USER }),
};
