import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Option } from '@music-ai/common';
import { Recommendation } from '@music-ai/recommendations';
import { RxPush } from '@rx-angular/template/push';
import { ButtonModule } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { combineLatest, map, Observable } from 'rxjs';
import { Recommendations } from '../../domain/recommendation/recommendations.service';

@Component({
  selector: 'msc-recommendation-controls',
  template: `<p-toolbar>
    <ng-template #start>
      <p-button
        severity="secondary"
        icon="pi pi-step-backward"
        [disabled]="prevDisabled$ | push"
        (onClick)="onPrev()"
      ></p-button>
    </ng-template>
    <ng-template #center>
      <a
        pButton
        [ngClass]="{ 'p-disabled': current$ | push }"
        [href]="spotify()"
        severity="secondary"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="spotify.png" alt="spotify logo" />
      </a>
    </ng-template>
    <ng-template #end>
      <p-button
        severity="secondary"
        icon="pi pi-step-forward"
        [disabled]="nextDisabled$ | push"
        (onClick)="onNext()"
      ></p-button>
    </ng-template>
  </p-toolbar>`,
  imports: [CommonModule, Toolbar, ButtonModule, RxPush],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommnedationControlsComponent {
  public prevDisabled$: Observable<boolean>;
  public nextDisabled$: Observable<boolean>;
  public current$: Observable<boolean>;
  public spotify = signal('');

  constructor(private readonly _recommendations: Recommendations) {
    this.prevDisabled$ = this._recommendations.index$.pipe(
      map((index) => index < 1),
    );

    this.nextDisabled$ = combineLatest([
      this._recommendations.index$,
      this._recommendations.length$,
    ]).pipe(map(([index, length]) => index === length));

    this.current$ = this._recommendations.current$.pipe(
      map((current) => {
        return !this._spotify(current);
      }),
    );
  }

  public onNext(): void {
    this._recommendations.next();
  }

  public onPrev(): void {
    this._recommendations.prev();
  }

  public _spotify(current: Option<Recommendation>): boolean {
    return current.match({
      none: () => false,
      some: (recommendation) =>
        Option.from(recommendation.metadata[0])
          .inspect((r) => {
            console.log('OXE');
            this.spotify.set(r.url);
          })
          .map((r) => r.name === 'spotify')
          .isSome(),
    });
  }
}
