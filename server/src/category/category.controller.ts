import { Controller, Get, Post, Body, Param, Delete, HttpCode, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }
  @Get('buy-id/:id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }
  @Get('buy-slug/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoryService.getCategoryBySlug(slug);
  }
  @HttpCode(200)
  @Post()
  async createCategory() {
    return this.categoryService.createCategory();
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() dto: CategoryDto) {
    return this.categoryService.updateCategory(id, dto);
  }
  @HttpCode(200)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
