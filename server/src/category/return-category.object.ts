import { Prisma } from 'generated/prisma';

export const returnCategoryObject: Prisma.CategorySelect = {
  id: true,
  name: true,
  slug: true,
  image: true,
};
