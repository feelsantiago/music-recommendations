import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { SliderItemDirective } from '../slider/slider-item.directive';
import { RecommendationItemComponent } from './recommendation-item.component';
import { RecommendationTagComponent } from './recommendation-tag.component';
import { RecommnedationControlsComponent } from './recommendation-controls.component';

@Component({
  selector: 'msc-recommendation',
  template: `
    <msc-slider>
      @for(recommendation of recommendations; track recommendation.id) {
      <msc-recommendation-item [item]="recommendation.id" mscSliderItem>
        {{ recommendation.id }}
      </msc-recommendation-item>
      }
    </msc-slider>
    <div class="mt-10">
      <msc-recommendation-tag></msc-recommendation-tag>
    </div>
    <div class="mt-10">
      <msc-recommendation-controls></msc-recommendation-controls>
    </div>
  `,
  imports: [
    RecommendationItemComponent,
    RecommendationTagComponent,
    RecommnedationControlsComponent,
    SliderComponent,
    SliderItemDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationComponent {
  public recommendations = [
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
}
