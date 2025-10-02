import { Option } from '@music-ai/common';
import { RecommendationType } from '@music-ai/recommendations';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { match } from 'ts-pattern';

@Injectable()
export class RecommendationTypePipe implements PipeTransform {
  public transform(
    value: string | undefined | null,
    _: ArgumentMetadata,
  ): RecommendationType {
    const type = Option.from(value);
    return match<string, RecommendationType>(type.unwrapOr('album'))
      .with('album', () => 'album')
      .with('artist', () => 'artist')
      .with('song', () => 'song')
      .otherwise(() => 'album');
  }
}
