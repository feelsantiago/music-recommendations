import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { Recommendations } from '../../domain/recommendation/recommendations.service';

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
  constructor(private readonly _recommendations: Recommendations) {}

  public onNext(): void {
    this._recommendations.next();
  }

  public onPrev(): void {
    this._recommendations.prev();
  }
}
