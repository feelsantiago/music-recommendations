import { AppError, AppErrorOptions } from '@music-ai/common';
import { PromptType } from './prompt/prompt';

export type GeminiErrorName =
  | 'prompt_generation'
  | 'empty_prompt'
  | 'parse_prompt_response'
  | 'empty_tags';

export class GeminiError extends AppError {
  private constructor(
    public readonly type: GeminiErrorName,
    message: string,
    options: Omit<AppErrorOptions, 'name'> = {},
  ) {
    super(message, { ...options, name: type });
  }

  public static generate(
    type: PromptType,
    options: Omit<AppErrorOptions, 'name'> = {},
  ): GeminiError {
    return new GeminiError(
      'prompt_generation',
      `[Prompt - Generate] - Unable to generate ${type} prompt`,
      options,
    );
  }

  public static parse(
    options: Omit<AppErrorOptions, 'name'> = {},
  ): GeminiError {
    return new GeminiError(
      'parse_prompt_response',
      '[Prompt - Response] - Unable to parse data',
      options,
    );
  }

  public static empty(
    options: Omit<AppErrorOptions, 'name'> = {},
  ): GeminiError {
    return new GeminiError(
      'empty_prompt',
      '[Prompt - Response] - Response text is empty',
      options,
    );
  }

  public static emptyTags(
    source: AppError,
    options: Omit<AppErrorOptions, 'name' | 'source'> = {},
  ): GeminiError {
    return new GeminiError(
      'empty_tags',
      '[Prompt - Response] - No tags provided',
      {
        ...options,
        source,
      },
    );
  }
}
