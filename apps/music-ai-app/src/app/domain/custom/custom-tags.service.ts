import { Injectable } from '@angular/core';
import { Tag } from '@music-ai/tags';
import { rxState } from '@rx-angular/state';
import { rxEffects } from '@rx-angular/state/effects';
import { AppStorage } from '../../storage/app-storage';
import { TagColorful } from '../tags/tags.types';

interface CustomTagsState {
  tags: TagColorful[];
}

@Injectable({ providedIn: 'root' })
export class CustomTags {
  private readonly _state = rxState<CustomTagsState>(({ set }) =>
    set({ tags: [] }),
  );
  private readonly _effects = rxEffects();
  private _key = 'custom_tags';

  public readonly tags$ = this._state.select('tags');

  constructor(private readonly _storage: AppStorage) {
    const tags = this._storage
      .fetch<TagColorful[]>(this._key)
      .match<TagColorful[], TagColorful[]>({
        some: (tags) => tags,
        none: () => [],
      });

    this._state.set('tags', () => tags);

    this._effects.register(this.tags$, (tags) =>
      this._storage.save(this._key, tags),
    );
  }

  public save(tag: TagColorful): void {
    this._state.set('tags', ({ tags }) => [...tags, tag]);
  }

  public remove(tag: Tag): void {
    this._state.set('tags', ({ tags }) => tags.filter((t) => t.id !== tag.id));
  }
}
