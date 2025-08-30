import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RecommendationComponent } from '../recommendation/recommendation.component';

@Component({
  selector: 'msc-home',
  template: `<msc-recommendation></msc-recommendation>`,
  imports: [RecommendationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
