import {
  ChangeDetectionStrategy,
  Component,
  output,
  viewChild,
} from '@angular/core';
import { SliderDirective } from './slider.directive';
import { SliderIndex } from './types';

@Component({
  selector: 'msc-ui-slider',
  template: `<div
    mscUiSlider
    (slideChanged)="slideChanged.emit($event)"
    class="keen-slider"
  >
    <ng-content></ng-content>
  </div>`,
  imports: [SliderDirective],
  styleUrls: ['../../../../../../node_modules/keen-slider/keen-slider.min.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent {
  public slideChanged = output<SliderIndex>();
  private readonly _slider = viewChild.required(SliderDirective);

  public next(): void {
    this._slider().next();
  }

  public prev(): void {
    this._slider().prev();
  }
}
