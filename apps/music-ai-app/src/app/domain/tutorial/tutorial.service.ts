import { Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { rxEffects } from '@rx-angular/state/effects';
import { filter } from 'rxjs';
import { AppStorage } from '../../storage/app-storage';

export interface TutorialImage {
  url: string;
  description: string;
}

interface TutorialState {
  enabled: boolean;
  images: TutorialImage[];
}

@Injectable({ providedIn: 'root' })
export class Tutorial {
  private _key = 'tutorial_enabled';
  private _state = rxState<TutorialState>(({ set }) => {
    const images = [
      {
        url: 'tutorial/tutorial-1.png',
        description: 'Start by clicking on the + button.',
      },
      {
        url: 'tutorial/tutorial-2.png',
        description: 'Select the tags that reflect what you want to listen to.',
      },
      {
        url: 'tutorial/tutorial-3.png',
        description:
          'Swap right and left to see more recommendations or use the controls. More recommendations will be auto fetch when you reach the last one.',
      },
    ];

    set({ enabled: true, images });
  });

  private _effects = rxEffects();

  public enabled = this._state.select('enabled');
  public images = this._state.select('images');

  constructor(private readonly _storage: AppStorage) {
    const enabled = this._storage
      .fetch<string>(this._key)
      .map(Boolean)
      .unwrapOr(true);

    this._state.set('enabled', () => enabled);

    this._effects.register(
      this.enabled.pipe(filter((enabled) => !enabled)),
      () => this._storage.save(this._key, `${false}`),
    );
  }

  public update(status: boolean): void {
    this._state.set('enabled', () => status);
  }
}
