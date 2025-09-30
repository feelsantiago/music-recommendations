import { err, ok, Result } from '@sapphire/result';
import { AppError } from './app-error';

export class LimitedValue {
  private constructor(
    public readonly value: number,
    public readonly limit: number,
  ) {}

  public static create(
    value: number,
    limit: number,
  ): Result<LimitedValue, AppError> {
    if (value > limit) {
      return err(
        AppError.create('Value is greater than the limit', {
          metadata: { value, limit },
        }),
      );
    }

    return ok(new LimitedValue(value, limit));
  }

  public static zero(limit: number): LimitedValue {
    return new LimitedValue(0, limit);
  }

  public increment(value: number): Result<LimitedValue, AppError> {
    return LimitedValue.create(this.value + value, this.limit);
  }

  public safeIncrement(value: number): LimitedValue {
    const total = this.value + value;
    return new LimitedValue(
      total > this.limit ? this.limit : total,
      this.limit,
    );
  }

  public full(): boolean {
    return this.value >= this.limit;
  }

  public incomplete(): boolean {
    return this.value < this.limit;
  }

  public reset(): LimitedValue {
    return new LimitedValue(0, this.limit);
  }
}
