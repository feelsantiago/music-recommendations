import { RecommendationPayload } from '@music-ai/recommendations';
import { Transform, Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { RecommendationTagDto } from './recommendation-tag.dto';

export class RecommendationDto implements Omit<RecommendationPayload, 'tags'> {
  @Type(() => String)
  @Transform(
    ({ value }) => {
      return (value as string[]).map((tag) => RecommendationTagDto.create(tag));
    },
    { toClassOnly: true },
  )
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  public tags: RecommendationTagDto[];
}
