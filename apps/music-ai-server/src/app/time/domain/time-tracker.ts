import { AppError, err, ok, Result } from '@music-ai/common';

export class TimeTrackerValue {
  private constructor(private readonly _value: number) {}

  public static minute(value: number): Result<TimeTracker, AppError> {
    if (value < 1 || value > 60) {
      return err(AppError.create('Minute must be between 1 and 24'));
    }

    return ok(new TimeTracker(value));
  }

  public static day(value: number): Result<TimeTracker, AppError> {
    if (value < 1 || value > 31) {
      return err(AppError.create('Day must be between 1 and 31'));
    }

    return ok(new TimeTracker(value));
  }

  public static hour(value: number): Result<TimeTracker, AppError> {
    if (value < 1 || value > 24) {
      return err(AppError.create('Hour must be between 1 and 24'));
    }

    return ok(new TimeTracker(value));
  }

  public value(): number {
    return this._value;
  }

  public compare(other: TimeTracker): boolean {
    return this.value() === other.value();
  }
}
