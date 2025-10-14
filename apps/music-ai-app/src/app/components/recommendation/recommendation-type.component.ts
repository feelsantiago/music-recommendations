import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'msc-recommendation-type',
  template: `<div class="flex justify-center items-center">
    <p-selectbutton
      [options]="options"
      [(ngModel)]="selected"
      [unselectable]="true"
      optionLabel="label"
      optionValue="value"
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
    },
    {
      label: 'Album',
      value: 'album',
    },
    {
      label: 'Artist',
      value: 'artist',
    },
  ];

  public selected = this.options[1].value;
}
