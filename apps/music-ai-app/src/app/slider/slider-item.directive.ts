import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[mscSliderItem]',
})
export class SliderItemDirective {
  @HostBinding('class') public slide = 'keen-slider__slide';
}
