import { PROMPT_SCHEMA } from './prompt-schema';

export type PromptType = 'album' | 'artist' | 'music';

export class Prompt {
  public static readonly schema = PROMPT_SCHEMA;

  constructor(private readonly _type: PromptType) {}

  public static album(): Prompt {
    return new Prompt('album');
  }

  public static artist(): Prompt {
    return new Prompt('artist');
  }

  public static music(): Prompt {
    return new Prompt('music');
  }

  public text(tags: string): string {
    return `Recommend to me 5 ${this._type} that are ${tags}`;
  }
}
