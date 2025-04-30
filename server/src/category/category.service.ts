import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnCategoryObject } from './return-category.object';
import { CategoryDto } from './dto/category.dto';
import { generatedSlug } from 'src/utils/generate-slug';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async getAllCategories() {
    return this.prisma.category.findMany({
      select: returnCategoryObject,
    });
  }
  async getCategoryById(id: string) {
    const category = this.prisma.category.findUnique({
      where: { id },
      select: returnCategoryObject,
    });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
  async getCategoryBySlug(slug: string) {
    const category = this.prisma.category.findUnique({
      where: { slug },
      select: returnCategoryObject,
    });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
  async createCategory() {
    const category = this.prisma.category.create({
      data: {
        name: 'New Category',
        slug: 'new-category',
        image: 'https://via.placeholder.com/150',
      },
    });
    return category;
  }
  async updateCategory(id: string, dto: CategoryDto) {
    const category = this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        image: dto.image,
        slug: generatedSlug(dto.name),
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
  async deleteCategory(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
