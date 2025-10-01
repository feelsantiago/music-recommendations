import { AppError, NotEmptyList, Result } from '@music-ai/common';
import {
  RecommendationTag,
  RecommendationType,
} from '../recommendations.types';

export class Prompt {
  constructor(
    public readonly type: RecommendationType,
    public readonly length: number,
  ) {}

  public static song(length: number): Prompt {
    return new Prompt('song', length);
  }

  public static album(length: number): Prompt {
    return new Prompt('album', length);
  }

  public static artist(length: number): Prompt {
    return new Prompt('artist', length);
  }

  public text(tags: RecommendationTag[]): Result<string, AppError> {
    const base = `Recommend to me ${this.length} music ${this.type}`;
    return NotEmptyList.create(tags).map(
      (list) => `${base} ${this._tags(list)}`,
    );
  }

  public _tags(tags: NotEmptyList<RecommendationTag>): string {
    return tags
      .pop()
      .map((last) => `that are ${tags.join(', ')} and ${last}.`)
      .unwrapOr(`that are ${tags.join(', ')}.`);
  }
}
