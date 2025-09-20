import { SystemTags } from '@music-ai/tags';
import { Controller, Get, HttpCode } from '@nestjs/common';
import { TAGS } from './tags.const';

@Controller('tags')
export class TagsController {
  @Get()
  @HttpCode(200)
  public all(): SystemTags {
    return TAGS;
  }
}
