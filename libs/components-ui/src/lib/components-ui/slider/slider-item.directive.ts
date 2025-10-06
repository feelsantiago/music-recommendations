import { Directive, HostBinding, input } from '@angular/core';

@Directive({
  selector: '[mscUiSliderItem]',
})
export class SliderItemDirective {
  public index = input(0, { alias: 'mscUiSliderItem' });

  @HostBinding('class') public slide = `keen-slider__slide slide_${this.index}`;
}
