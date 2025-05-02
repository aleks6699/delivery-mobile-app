import { Prisma } from "generated/prisma";

export const returnUserObject: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  avatarPath: true,
  password: false,
  phone: true,
};
