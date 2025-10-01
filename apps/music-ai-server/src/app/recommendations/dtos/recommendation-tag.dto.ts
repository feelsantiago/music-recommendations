import { AppError } from '@music-ai/common';
import { IsString } from 'class-validator';
import validator from 'validator';

export class RecommendationTagDto {
  @IsString()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: unknown): RecommendationTagDto {
    if (typeof value === 'string') {
      return new RecommendationTagDto(validator.escape(value));
    }

    throw new AppError('Tags must be strings');
  }
}
