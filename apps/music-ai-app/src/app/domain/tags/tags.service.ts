import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { TAGS } from './tags.const';
import { GroupedTags, TagSelected } from './tags.types';

@Injectable({
  providedIn: 'root',
})
export class Tags {
  private readonly _tags$ = new BehaviorSubject<TagSelected[]>([]);

  public selected$ = this._tags$.asObservable();

  public select(tags: TagSelected[]): void {
    this._tags$.next(tags);
  }

  public fetch(): Observable<GroupedTags> {
    return of(TAGS).pipe(
      map((tags) => ({
        genre: tags.genre.map((tag) => ({ ...tag, severity: 'unset' })),
        mood: tags.mood.map((tag) => ({ ...tag, severity: 'unset' })),
        custom: tags.custom.map((tag) => ({ ...tag, severity: 'unset' })),
      })),
    );
  }
}
