import { LimitedValue } from './limited-value';

export class RateLimit {
  private constructor(private _value: LimitedValue) {}

  public static create(limit: number): RateLimit {
    return new RateLimit(LimitedValue.zero(limit));
  }

  public increment(): void {
    this._value = this._value.safeIncrement(1);
  }

  public add(value: number): void {
    this._value = this._value.safeIncrement(value);
  }

  public reset(): void {
    this._value = this._value.reset();
  }

  public available(): boolean {
    return this._value.incomplete();
  }
}
