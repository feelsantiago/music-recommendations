import { Injectable } from '@angular/core';

export abstract class Random {
  public abstract next(): number;
  public abstract between(min: number, max: number): number;
  public abstract range(length: number): number;
}

@Injectable()
export class MathRandom implements Random {
  public next(): number {
    return Math.random();
  }

  public between(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  public range(length: number): number {
    return Math.floor(Math.random() * length);
  }
}

@Injectable()
export class DistinctRandom implements MathRandom {
  private _last = 0;

  constructor(private readonly _random: Random) {}

  public static create(): DistinctRandom {
    return new DistinctRandom(new MathRandom());
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
