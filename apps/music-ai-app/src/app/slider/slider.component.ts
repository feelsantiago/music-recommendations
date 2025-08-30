import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { SliderDirective } from './slider.directive';
import { SliderIndex } from './types';

@Component({
  selector: 'msc-slider',
  template: `<div
    mscSlider
    (slideChanged)="slideChanged.emit($event)"
    class="keen-slider"
  >
    <ng-content></ng-content>
  </div>`,
  imports: [SliderDirective],
  styleUrls: ['../../../../../node_modules/keen-slider/keen-slider.min.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent {
  public slideChanged = output<SliderIndex>();
}
