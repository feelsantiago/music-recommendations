import { Injectable } from '@angular/core';
import { Random } from '../random/random';
import { SEVERITIES } from './theme.const';
import { Severity } from './theme.types';

export abstract class Colorize<T = string> {
  public abstract apply<K = object>(obj: K): K & { color: T };
}

@Injectable()
export class SeverityColorize implements Colorize<Severity> {
  private readonly _colors: Severity[] = SEVERITIES.filter(
    (severity) => severity !== 'contrast',
  );

  constructor(private readonly _random: Random) {}

  public apply<K = object>(obj: K): K & { color: Severity } {
    const color = this._random.range(this._colors.length);
    return { ...obj, color: this._colors[color] };
  }
}
