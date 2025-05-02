import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  HttpCode,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductDto } from "./dto/product.dto";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query("searchTerm") searchTerm: string) {
    return this.productService.getAllProducts(searchTerm);
  }
  @Get("buy-id/:id")
  async getCategoryById(@Param("id") id: string) {
    return this.productService.getProductById(id);
  }
  @Get("buy-slug/:slug")
  async getProductBySlug(@Param("slug") slug: string) {
    return this.productService.getProductBySlug(slug);
  }
  @HttpCode(200)
  @Post()
  async createProduct() {
    return this.productService.createProduct();
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(":id")
  async updateProduct(@Param("id") id: string, @Body() dto: ProductDto) {
    return this.productService.updateCategory(id, dto);
  }
  @HttpCode(200)
  @Delete(":id")
  async deleteProduct(@Param("id") id: string) {
    return this.productService.deleteProduct(id);
  }
  @Get("by-category/:categorySlug")
  async getProductByCategory(@Param("categorySlug") categorySlug: string) {
    return this.productService.byCategory(categorySlug);
  }
}
