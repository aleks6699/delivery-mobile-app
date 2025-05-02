import { Injectable } from "@nestjs/common";
import { CategoryService } from "src/category/category.service";
import { PrismaService } from "src/prisma.service";
import { generatedSlug } from "src/utils/generate-slug";
import { ProductDto } from "./dto/product.dto";
import { returnProductObject } from "./return-product.object";

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}
  async getAllProducts(searchTerm?: string) {
    if (searchTerm) return this.searchProduct(searchTerm);
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: returnProductObject,
    });
  }
  async searchProduct(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      select: returnProductObject,
    });
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: returnProductObject,
    });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
  async byCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: { category: { slug: categorySlug } },
      select: returnProductObject,
    });
    if (!products) {
      throw new Error("Products not found");
    }
    return products;
  }
  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: returnProductObject,
    });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
  async createProduct() {
    const product = this.prisma.product.create({
      data: {
        description: "",
        name: "",
        price: 0,
        slug: "",
        image: "",
      },
    });
    return product;
  }
  async updateCategory(id: string, dto: ProductDto) {
    const { categoryId, price, name, description, image } = dto;
    await this.categoryService.getCategoryById(categoryId);

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name,
        slug: generatedSlug(name),
        image,
        price,
        description,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
