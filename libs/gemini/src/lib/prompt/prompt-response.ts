import { GenerateContentResponse, Type } from '@google/genai';
import { Option, Result } from '@music-ai/common';
import {
  Recommendation,
  RecommendationHistory,
} from '@music-ai/recommendations';
import { GeminiError } from '../gemini.errors';

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

export const PROMPT_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      artist: { type: Type.STRING },
    },
    propertyOrdering: ['name', 'artist'],
  },
};

export type PromptSchema = Omit<Recommendation, 'metadata'>;

export class PromptResponse {
  constructor(
    public readonly id: string,
    public readonly tokens: TokenCount,
    public readonly text: Option<string>,
    public readonly history: RecommendationHistory[],
  ) {}

  public static from(
    response: GenerateContentResponse,
    message: string,
    history: RecommendationHistory[] = [],
  ): PromptResponse {
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
      [...history, { role: 'user', parts: [{ text: message }] }],
    );
  }

  public data(): Result<PromptSchema[], GeminiError> {
    return this.text
      .okOr(GeminiError.empty())
      .inspect((data) =>
        this.history.push({ role: 'model', parts: [{ text: data }] }),
      )
      .andThen((text: string) =>
        Result.from(() => JSON.parse(text)).mapErr(() =>
          GeminiError.parse({ metadata: { text } }),
        ),
      )
      .map((data) => data as PromptSchema[]);
  }
}
