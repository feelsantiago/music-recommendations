import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'msc-recommendation-item',
  template: `<div class="h-120 flex justify-center items-center">
    <p-skeleton height="250px" width="70%"></p-skeleton>
  </div>`,
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationItemComponent {
  public readonly item = input<number>();
}
