import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  index() {
    return this.prisma.eventCategory.findMany({ orderBy: { name: 'asc' } });
  }
}
