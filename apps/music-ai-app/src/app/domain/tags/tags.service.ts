import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TAGS } from './tags.const';
import { ColorizedTag, GroupedTags } from './tags.types';

@Injectable({
  providedIn: 'root',
})
export class Tags {
  private readonly _tags$ = new BehaviorSubject<ColorizedTag[]>([]);

  public selected$ = this._tags$.asObservable();

  public select(tags: ColorizedTag[]): void {
    this._tags$.next(tags);
  }

  public fetch(): Observable<GroupedTags> {
    return of(TAGS);
  }
}
