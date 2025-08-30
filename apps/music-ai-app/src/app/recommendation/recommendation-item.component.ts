import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'msc-recommendation-item',
  template: `<div class="h-100 flex flex-col justify-end items-center">
    <p-skeleton height="250px" width="70%"></p-skeleton>
    <p class="p-2 pt-4">Album Title</p>
    <P>Artist</P>
  </div>`,
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationItemComponent {
  public readonly item = input<number>();
}
