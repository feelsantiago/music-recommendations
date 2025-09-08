import { Injectable } from '@angular/core';
import { Random } from './random';

@Injectable()
export class RandomNumber implements Random {
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
