import { Injectable } from '@angular/core';
import { Random } from '@music-ai/random';
import { Colorize } from '../colorize';
import { SEVERITIES } from './const';
import { Severity } from './types';

@Injectable()
export class SeverityColorize implements Colorize<Severity> {
  private readonly _colors: Severity[] = SEVERITIES.filter(
    (severity) => !['contrast', 'unset'].includes(severity),
  );

  constructor(private readonly _random: Random) {}

  public apply<K = object>(obj: K): K & { severity: Severity } {
    const severity = this._random.range(this._colors.length);
    return { ...obj, severity: this._colors[severity] };
  }
}
