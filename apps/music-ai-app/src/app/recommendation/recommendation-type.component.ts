import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'msc-recommendation-type',
  template: `<div class="flex justify-center items-center">
    <p-selectbutton
      [options]="options"
      [(ngModel)]="selected"
      optionLabel="label"
      optionValue="value"
      optionDisabled="disabled"
    ></p-selectbutton>
  </div>`,
  imports: [SelectButton, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTypeComponent {
  public options = [
    {
      label: 'Music',
      value: 'music',
      disabled: true,
    },
    {
      label: 'Album',
      value: 'album',
      disabled: false,
    },
    {
      label: 'Artist',
      value: 'artist',
      disabled: true,
    },
  ];

  public selected = this.options[1].value;
}
