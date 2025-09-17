import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'msc-recommendation-controls',
  template: `<p-toolbar>
    <ng-template #start>
      <p-button
        severity="secondary"
        icon="pi pi-step-backward"
        (onClick)="prev.emit()"
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
        (onClick)="next.emit()"
      ></p-button>
    </ng-template>
  </p-toolbar>`,
  imports: [Toolbar, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommnedationControlsComponent {
  public next = output();
  public prev = output();
}
