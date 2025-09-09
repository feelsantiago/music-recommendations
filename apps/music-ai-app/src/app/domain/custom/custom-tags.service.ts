import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { AppStorage } from '../../storage/app-storage';
import { Tag } from '../tags/tags.types';

@Injectable({ providedIn: 'root' })
export class CustomTags {
  private readonly _tags$ = new BehaviorSubject<Tag[]>([]);

  public readonly tags$ = this._tags$.asObservable();

  private _key = 'custom_tags';

  constructor(private readonly _storage: AppStorage) {}

  public save(tag: Tag): void {
    this._storage.fetch<Tag[]>(this._key).match({
      some: (tags) => this._storage.save(this._key, [...tags, tag]),
      none: () => this._storage.save(this._key, [tag]),
    });

    this._tags$.next([...this._tags$.getValue(), tag]);
  }

  public load(): Observable<Tag[]> {
    const tags = this._storage.fetch<Tag[]>(this._key).match<Tag[], Tag[]>({
      some: (tags) => tags,
      none: () => [],
    });

    return of(tags).pipe(tap((tags) => this._tags$.next(tags)));
  }
}
