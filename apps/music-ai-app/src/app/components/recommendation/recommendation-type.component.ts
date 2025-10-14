import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RecommendationType } from '@music-ai/recommendations';
import { SelectButton, SelectButtonChangeEvent } from 'primeng/selectbutton';
import { Recommendations } from '../../domain/recommendation/recommendations.service';

@Component({
  selector: 'msc-recommendation-type',
  template: `<div class="flex justify-center items-center">
    <p-selectbutton
      [options]="options"
      [ngModel]="selected()"
      [unselectable]="true"
      optionLabel="label"
      optionValue="value"
      (onChange)="onTypeChange($event)"
    ></p-selectbutton>
  </div>`,
  imports: [SelectButton, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTypeComponent {
  public options: { label: string; value: RecommendationType }[] = [
    {
      label: 'Music',
      value: 'song',
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

  public selected: Signal<RecommendationType>;

  constructor(private readonly _recommendations: Recommendations) {
    this.selected = toSignal(this._recommendations.type$, {
      initialValue: 'album',
    });
  }

  public onTypeChange(event: SelectButtonChangeEvent): void {
    this._recommendations.type(event.value);
  }
}
