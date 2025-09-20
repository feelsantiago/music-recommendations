import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { SliderComponent, SliderItemDirective } from '@music-ai/components-ui';
import { rxEffects } from '@rx-angular/state/effects';
import { Recommendation } from '../../domain/recommendation/recommendation.service';
import { RecommendationItemComponent } from './recommendation-item.component';

@Component({
  selector: 'msc-recommendation',
  template: `
    <msc-ui-slider>
      @for (recommendation of recommendations; track recommendation.id) {
        <msc-recommendation-item [item]="recommendation.id" mscUiSliderItem>
          {{ recommendation.id }}
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
  public readonly recommendations = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ];

  constructor(private readonly _recommendation: Recommendation) {
    this._effects.register(this._recommendation.next$, () =>
      this.slider().next(),
    );
    this._effects.register(this._recommendation.prev$, () =>
      this.slider().prev(),
    );
  }
}
