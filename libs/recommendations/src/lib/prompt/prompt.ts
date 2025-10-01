import { AppError, NotEmptyList, Result } from '@music-ai/common';
import {
  RecommendationTag,
  RecommendationType,
} from '../recommendations.types';

export class Prompt {
  constructor(public readonly type: RecommendationType) {}

  public static song(): Prompt {
    return new Prompt('song');
  }

  public static album(): Prompt {
    return new Prompt('album');
  }

  public static artist(): Prompt {
    return new Prompt('artist');
  }

  public text(tags: RecommendationTag[]): Result<string, AppError> {
    const base = `Recommend to me 5 music ${this.type}`;
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
