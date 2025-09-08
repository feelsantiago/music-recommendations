import { Injectable } from '@angular/core';
import { Random } from './random';
import { RandomNumber } from './random-number';

@Injectable()
export class DistinctRandom implements Random {
  private _last = 0;

  constructor(private readonly _random: Random) {}

  public static number(): DistinctRandom {
    return new DistinctRandom(new RandomNumber());
  }

  public next(): number {
    return this._distinct(() => this._random.next());
  }

  public between(min: number, max: number): number {
    return this._distinct(() => this._random.between(min, max));
  }

  public range(length: number): number {
    return this._distinct(() => this._random.range(length));
  }

  private _distinct(callback: () => number): number {
    let value = callback();

    while (value === this._last) {
      value = callback();
    }

    this._last = value;
    return this._last;
  }
}
