import { ChangeDetectionStrategy, Component } from '@angular/core';
import { none, Option } from '@music-ai/common';
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
      <p-button severity="secondary" [disabled]="current$ | push">
        <img src="spotify.png" alt="spotify logo" />
      </p-button>
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
  imports: [Toolbar, ButtonModule, RxPush],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommnedationControlsComponent {
  public prevDisabled$: Observable<boolean>;
  public nextDisabled$: Observable<boolean>;
  public current$: Observable<boolean>;

  private _current: Option<Recommendation> = none;

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
        return (this._current = current);
      }),
      map((current) => current.isNone()),
    );
  }

  public onNext(): void {
    this._recommendations.next();
  }

  public onPrev(): void {
    this._recommendations.prev();
  }
}
