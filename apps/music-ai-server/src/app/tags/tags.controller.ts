import { SystemTags } from '@music-ai/tags';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { TAGS } from './tags.const';

@Controller('tags')
export class TagsController {
  @Get()
  @HttpCode(HttpStatus.OK)
  public all(): SystemTags {
    return TAGS;
  }
}
