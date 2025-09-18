import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RecommendationComponent } from '../components/recommendation/recommendation.component';
import { AuthApi } from '../domain/auth/auth.api';

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
export class HomePage {
  constructor(private readonly _api: AuthApi) {
    this._api.test().subscribe(console.log);
  }
}
