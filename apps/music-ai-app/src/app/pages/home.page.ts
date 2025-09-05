import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RecommendationComponent } from '../recommendation/recommendation.component';

@Component({
  selector: 'msc-home',
  template: `
    <div class="max-w-120 mx-auto">
      <msc-recommendation></msc-recommendation>
    </div>
  `,
  imports: [RecommendationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
