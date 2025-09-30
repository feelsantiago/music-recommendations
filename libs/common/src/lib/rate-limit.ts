import { LimitedValue } from '@music-ai/common';
import { TimePassed } from '../../time/time.types';

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

  public update(time: TimePassed): void {
    if (time === 'different_time') {
      this._value = this._value.reset();
    }
  }

  public available(): boolean {
    return this._value.incomplete();
  }
}
