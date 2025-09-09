import { Injectable } from '@angular/core';
import { Option, Result } from '@sapphire/result';
import { match, P } from 'ts-pattern';

@Injectable({ providedIn: 'root' })
export class AppStorage {
  public save(key: string, value: string | object): void {
    match(value)
      .with(P.string, (data) => localStorage.setItem(key, data))
      .otherwise((data) => localStorage.setItem(key, JSON.stringify(data)));
  }

  public fetch<T>(key: string): Option<T> {
    const data = Option.from(() => localStorage.getItem(key));

    if (data.isSome()) {
      return Result.from(() => JSON.parse(data.unwrap())).ok() as Option<T>;
    }

    return data as Option<T>;
  }
}
