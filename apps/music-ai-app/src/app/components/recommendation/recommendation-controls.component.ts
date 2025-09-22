import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { Recommendation } from '../../domain/recommendation/recommendation.service';

@Component({
  selector: 'msc-recommendation-controls',
  template: `<p-toolbar>
    <ng-template #start>
      <p-button
        severity="secondary"
        icon="pi pi-step-backward"
        (onClick)="onPrev()"
      ></p-button>
    </ng-template>
    <ng-template #center>
      <p-button severity="secondary">
        <img src="spotify.png" alt="spotify logo" />
      </p-button>
    </ng-template>
    <ng-template #end>
      <p-button
        severity="secondary"
        icon="pi pi-step-forward"
        (onClick)="onNext()"
      ></p-button>
    </ng-template>
  </p-toolbar>`,
  imports: [Toolbar, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommnedationControlsComponent {
  constructor(private readonly _recommendation: Recommendation) {}

  public onNext(): void {
    this._recommendation.next();
  }

  public onPrev(): void {
    this._recommendation.prev();
  }
}
