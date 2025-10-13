import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Signal,
} from '@angular/core';
import { Option } from '@music-ai/common';
import { Recommendation, RecommendationCover } from '@music-ai/recommendations';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'msc-recommendation-empty-item',
  template: `<div class="h-90 flex flex-col justify-end items-center">
    <p-skeleton height="280px" width="280px"></p-skeleton>
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
    @for (img of cover(); track img.height) {
      <img class="rounded-sm" [ngSrc]="img.url" width="280" height="280" />
    } @empty {
      <p-skeleton height="300px" width="300px"></p-skeleton>
    }
    <p class="mt-4">{{ item().name }}</p>
    <p class="mt-1">{{ item().artist }}</p>
  </div>`,
  imports: [Skeleton, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationItemComponent {
  public readonly item = input.required<Recommendation>();
  public cover: Signal<RecommendationCover[]>;

  constructor() {
    this.cover = computed(() => {
      const item = this.item();
      const metadata = Option.from(item.metadata[0]);
      const images = metadata.map((m) => m.images).unwrapOr([]);
      return images.filter((img) => img.height === 300);
    });
  }
}
