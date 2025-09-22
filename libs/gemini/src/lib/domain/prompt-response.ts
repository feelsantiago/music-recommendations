import { GenerateContentResponse } from '@google/genai';
import { Option, Result } from '@sapphire/result';

interface TokenCount {
  prompt: number;
  candidates: number;
  total: number;
  thoughts: number;
}

const EMPTY_METADATA = {
  promptTokenCount: 0,
  candidatesTokenCount: 0,
  totalTokenCount: 0,
  thoughtsTokenCount: 0,
};

export class PromptResponse {
  constructor(
    public readonly id: string,
    public readonly tokens: TokenCount,
    private readonly _text: Option<string>,
  ) {}

  public static from(response: GenerateContentResponse): PromptResponse {
    const text = Option.from(response.text);
    const id = response.responseId ?? 'No Response ID';
    const {
      promptTokenCount: prompt = 0,
      candidatesTokenCount: candidates = 0,
      totalTokenCount: total = 0,
      thoughtsTokenCount: thoughts = 0,
    } = response.usageMetadata ?? EMPTY_METADATA;

    return new PromptResponse(
      id,
      { prompt, candidates, total, thoughts },
      text,
    );
  }

  public data<T>(): Result<T, Error> {
    return this._text
      .okOr(new Error('No text in response'))
      .andThen((text: string) =>
        Result.from(() => JSON.parse(text)).mapErr(
          () => new Error('Unable to parse response'),
        ),
      )
      .map((data) => data as T);
  }
}
