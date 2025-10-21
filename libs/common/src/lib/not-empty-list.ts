import { err, none, ok, Option, Result } from '@sapphire/result';
import { AppError } from './app-error';

export class NotEmptyList<T> {
  private constructor(private readonly _values: T[]) {}

  public static create<T>(values: T[]): Result<NotEmptyList<T>, AppError> {
    if (values.length === 0) {
      return err(
        AppError.create('List should not be empty', { name: 'NoEmptyList' }),
      );
    }

    return ok(new NotEmptyList([...values]));
  }

  public values(): T[] {
    return this._values;
  }

  public head(): T {
    return this._values[0];
  }

  public join(separator: string): string {
    return this._values.join(separator);
  }

  public pop(): Option<T> {
    if (this._values.length <= 1) {
      return none;
    }

    return Option.from(this._values.pop());
  }
}
