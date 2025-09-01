import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'msc-recommendation-item',
  template: `<div class="h-90 flex flex-col justify-end items-center">
    <p-skeleton height="250px" width="70%"></p-skeleton>
    <p-skeleton class="mt-4" width="10rem"></p-skeleton>
    <p-skeleton class="m-2" width="5rem"></p-skeleton>
  </div>`,
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationItemComponent {
  public readonly item = input<number>();
}
