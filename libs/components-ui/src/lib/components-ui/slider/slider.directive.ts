import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  output,
} from '@angular/core';
import KeenSlider, { KeenSliderInstance, KeenSliderPlugin } from 'keen-slider';
import { SlideIndex } from './types';

const MutationPlugin: KeenSliderPlugin = (slider) => {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
      slider.update();
    });
  });
  const config = { childList: true };

  slider.on('created', () => {
    observer.observe(slider.container, config);
  });
  slider.on('destroyed', () => {
    observer.disconnect();
  });
};

@Directive({
  selector: '[mscUiSlider]',
})
export class SliderDirective implements AfterViewInit, OnDestroy {
  public slider!: KeenSliderInstance;
  public slideChanged = output<SlideIndex>();

  constructor(private readonly _element: ElementRef<HTMLHtmlElement>) {}

  public ngAfterViewInit(): void {
    this.slider = new KeenSlider(
      this._element.nativeElement,
      {
        slideChanged: (slider) =>
          this.slideChanged.emit(slider.track.details.rel),
      },
      [MutationPlugin],
    );
  }

  public next(): void {
    this.slider.next();
  }

  public prev(): void {
    this.slider.prev();
  }

  public update(): void {
    this.slider.update();
  }

  public ngOnDestroy(): void {
    this.slider.destroy();
  }
}
