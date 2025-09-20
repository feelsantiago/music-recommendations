import { Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { combineLatest, map, Observable } from 'rxjs';
import { CustomTags } from '../custom/custom-tags.service';
import { TagsApi } from './tags.api';
import { TagGroupedColorful, TagSelected } from './tags.types';

interface TagsState {
  selected: TagSelected[];
  tags: TagGroupedColorful;
}

@Injectable({
  providedIn: 'root',
})
export class Tags {
  private _state = rxState<TagsState>(({ set }) =>
    set({ selected: [], tags: { genre: [], mood: [], custom: [] } }),
  );

  public tags$ = this._state.select('tags');
  public selected$ = this._state.select('selected');

  constructor(
    private readonly _api: TagsApi,
    private readonly _custom: CustomTags,
  ) {
    const tags$ = combineLatest([this.fetch(), this._custom.tags$]).pipe(
      map(([tags, custom]) => ({ ...tags, custom })),
    );

    this._state.connect('tags', tags$);
  }

  public select(tags: TagSelected[]): void {
    this._state.set('selected', () => tags);
  }

  public fetch(): Observable<TagGroupedColorful> {
    return this._api.all().pipe(
      map((tags) => ({
        genre: tags.genre.map((tag) => ({ ...tag, severity: 'unset' })),
        mood: tags.mood.map((tag) => ({ ...tag, severity: 'unset' })),
        custom: [],
      })),
    );
  }
}
