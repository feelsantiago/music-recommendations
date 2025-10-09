import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SlideIndex,
  SliderComponent,
  SliderItemDirective,
} from '@music-ai/components-ui';
import { Recommendation } from '@music-ai/recommendations';
import { rxEffects } from '@rx-angular/state/effects';
import { Recommendations } from '../../domain/recommendation/recommendations.service';
import {
  RecommendationEmptyItemComponent,
  RecommendationItemComponent,
} from './recommendation-item.component';

@Component({
  selector: 'msc-recommendation',
  template: `
    <msc-ui-slider (slideChanged)="onSlideChange($event)">
      @for (
        recommendation of recommendations();
        track recommendation.name;
        let i = $index
      ) {
        <msc-recommendation-item
          [item]="recommendation"
          [mscUiSliderItem]="i"
        />
      } @empty {
        <msc-recommendation-empty-item [mscUiSliderItem]="0" />
      }
    </msc-ui-slider>
  `,
  imports: [
    RecommendationItemComponent,
    RecommendationEmptyItemComponent,
    SliderComponent,
    SliderItemDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationComponent {
  private readonly _effects = rxEffects();

  public readonly slider = viewChild.required(SliderComponent);
  public recommendations: Signal<Recommendation[]>;

  constructor(private readonly _recommendations: Recommendations) {
    this._effects.register(this._recommendations.next$, () =>
      this.slider().next(),
    );
    this._effects.register(this._recommendations.prev$, () =>
      this.slider().prev(),
    );

    this.recommendations = toSignal(this._recommendations.recommendations$, {
      initialValue: [],
    });
  }

  public onSlideChange(index: SlideIndex): void {
    this._recommendations.current(index);
  }
}
