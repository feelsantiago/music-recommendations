import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ToggleButton, ToggleButtonChangeEvent } from 'primeng/togglebutton';
import { Tooltip } from 'primeng/tooltip';
import { Settings } from '../../domain/settings/settings.service';

@Component({
  selector: 'msc-recommendation-settings',
  template: `<div class="flex justify-between items-center">
    <div class="flex items-center">
      <p>Auto Fetch</p>
      <i
        class="ms-2 pi pi-question-circle"
        pTooltip="Auto fetches more recommendations when you scroll to the last one."
        tooltipPosition="bottom"
      ></i>
    </div>
    <p-togglebutton
      [ngModel]="active()"
      (onChange)="onAutoFetchChange($event)"
      onLabel="On"
      offLabel="Off"
      size="small"
      class="min-w-16"
    />
  </div>`,
  imports: [FormsModule, ToggleButton, Tooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationSettingsComponent {
  public active: Signal<boolean>;

  constructor(private readonly _settings: Settings) {
    this.active = toSignal(this._settings.autoFetch$, { initialValue: true });
  }

  public onAutoFetchChange(event: ToggleButtonChangeEvent): void {
    this._settings.autoFetch(event.checked || false);
  }
}
