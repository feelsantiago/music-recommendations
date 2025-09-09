import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  output,
} from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { SliderIndex } from './types';

@Directive({
  selector: '[mscUiSlider]',
})
export class SliderDirective implements AfterViewInit, OnDestroy {
  public slider!: KeenSliderInstance;
  public slideChanged = output<SliderIndex>();

  constructor(private readonly _element: ElementRef<HTMLHtmlElement>) {}

  public ngAfterViewInit(): void {
    this.slider = new KeenSlider(this._element.nativeElement, {
      slideChanged: (slider) =>
        this.slideChanged.emit(slider.track.details.rel),
    });
  }

  public next(): void {
    this.slider.next();
  }

  public prev(): void {
    this.slider.prev();
  }

  public ngOnDestroy(): void {
    this.slider.destroy();
  }
}
