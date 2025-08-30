import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { SliderItemDirective } from '../slider/slider-item.directive';
import { RecommendationItemComponent } from './recommendation-item.component';

@Component({
  selector: 'msc-recommendation',
  template: `
    <div class="h-120">
      <msc-slider class="h-full">
        @for(recommendation of recommendations; track recommendation.id) {
        <msc-recommendation-item [item]="recommendation.id" mscSliderItem>
          {{ recommendation.id }}
        </msc-recommendation-item>
        }
      </msc-slider>
    </div>
  `,
  imports: [RecommendationItemComponent, SliderComponent, SliderItemDirective],
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
