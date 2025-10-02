import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SliderComponent, SliderItemDirective } from '@music-ai/components-ui';
import { Recommendation } from '@music-ai/recommendations';
import { rxEffects } from '@rx-angular/state/effects';
import { Recommendations } from '../../domain/recommendation/recommendations.service';
import { RecommendationItemComponent } from './recommendation-item.component';

@Component({
  selector: 'msc-recommendation',
  template: `
    <msc-ui-slider>
      @for (recommendation of recommendations(); track recommendation.album) {
        <msc-recommendation-item [item]="recommendation" mscUiSliderItem>
          {{ recommendation.album }}
        </msc-recommendation-item>
      } @empty {
        <msc-recommendation-item
          [item]="{ album: '', artist: '' }"
          mscUiSliderItem
        >
        </msc-recommendation-item>
      }
    </msc-ui-slider>
  `,
  imports: [RecommendationItemComponent, SliderComponent, SliderItemDirective],
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
}
