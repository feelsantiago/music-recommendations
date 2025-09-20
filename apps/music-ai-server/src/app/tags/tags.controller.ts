import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('tags')
export class TagsController {
  @Get()
  @HttpCode(200)
  public all(): unknown[] {
    return [];
  }
}
