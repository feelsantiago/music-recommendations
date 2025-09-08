import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[mscUiSliderItem]',
})
export class SliderItemDirective {
  @HostBinding('class') public slide = 'keen-slider__slide';
}
