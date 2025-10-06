import {
  ChangeDetectionStrategy,
  Component,
  effect,
  output,
  viewChild,
} from '@angular/core';
import { SliderDirective } from './slider.directive';
import { SlideIndex } from './types';

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
  public slideChanged = output<SlideIndex>();
  private readonly _slider = viewChild.required(SliderDirective);

  constructor() {
    effect(() => {
      this._slider().slideChanged.subscribe((value) =>
        this.slideChanged.emit(value),
      );
    });
  }

  public next(): void {
    this._slider().next();
  }

  public prev(): void {
    this._slider().prev();
  }

  public update(): void {
    this._slider().update();
  }
}
