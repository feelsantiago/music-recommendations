import { match } from 'ts-pattern';

export type DurationType =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year';

export class Duration {
  constructor(
    private readonly _value: number,
    private readonly _type: DurationType,
  ) {}

  public static milliseconds(value: number): Duration {
    return new Duration(value, 'millisecond');
  }

  public static seconds(value: number): Duration {
    return new Duration(value, 'second');
  }

  public static minutes(value: number): Duration {
    return new Duration(value, 'minute');
  }

  public static hours(value: number): Duration {
    return new Duration(value, 'hour');
  }

  public static days(value: number): Duration {
    return new Duration(value, 'day');
  }

  public static weeks(value: number): Duration {
    return new Duration(value, 'week');
  }

  public static months(value: number): Duration {
    return new Duration(value, 'month');
  }

  public static years(value: number): Duration {
    return new Duration(value, 'year');
  }

  public calculate(): number {
    return match(this._type)
      .with('millisecond', () => this._value)
      .with('second', () => this._value * 1000)
      .with('minute', () => this._value * 60 * 1000)
      .with('hour', () => this._value * 60 * 60 * 1000)
      .with('day', () => this._value * 24 * 60 * 60 * 1000)
      .with('week', () => this._value * 7 * 24 * 60 * 60 * 1000)
      .with('month', () => this._value * 30 * 24 * 60 * 60 * 1000)
      .with('year', () => this._value * 365 * 24 * 60 * 60 * 1000)
      .exhaustive();
  }
}
