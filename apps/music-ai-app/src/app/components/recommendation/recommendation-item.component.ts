import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Recommendation } from '@music-ai/recommendations';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'msc-recommendation-empty-item',
  template: `<div class="h-90 flex flex-col justify-end items-center">
    <p-skeleton height="250px" width="70%"></p-skeleton>
    <p-skeleton class="mt-4" width="10rem"></p-skeleton>
    <p-skeleton class="m-2" width="5rem"></p-skeleton>
  </div>`,
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationEmptyItemComponent {}

@Component({
  selector: 'msc-recommendation-item',
  template: `<div class="h-90 flex flex-col justify-end items-center">
    <p-skeleton height="250px" width="70%"></p-skeleton>
    <p class="mt-4">{{ item().album }}</p>
    <p class="mt-1">{{ item().artist }}</p>
  </div>`,
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationItemComponent {
  public readonly item = input.required<Recommendation>();
}
