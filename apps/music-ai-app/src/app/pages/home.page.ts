import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SeverityColorize } from '@music-ai/components-ui';
import { DistinctRandom, Random } from '@music-ai/random';
import { DrawerModule } from 'primeng/drawer';
import { RecommnedationControlsComponent } from '../components/recommendation/recommendation-controls.component';
import { RecommendationTypeComponent } from '../components/recommendation/recommendation-type.component';
import { RecommendationComponent } from '../components/recommendation/recommendation.component';
import { TagDrawerComponnet } from '../components/tags/tag-drawer.component';
import { TagListComponent } from '../components/tags/tag-list.component';
import { Recommendation } from '../domain/recommendation/recommendation.service';

@Component({
  selector: 'msc-home',
  template: `
    <div class="max-w-120 mx-auto">
      <msc-tag-drawer title="Choose..." [(open)]="drawer" />
      <msc-recommendation-type />
      <msc-recommendation />
      <div class="mt-10">
        <msc-tag-list (selectTag)="onOpenDrawer()" />
      </div>
      <div class="mt-10">
        <msc-recommendation-controls
          (prev)="onPrev()"
          (next)="onNext()"
        ></msc-recommendation-controls>
      </div>
    </div>
  `,
  imports: [
    TagDrawerComponnet,
    TagListComponent,
    RecommendationComponent,
    RecommendationTypeComponent,
    RecommnedationControlsComponent,
    DrawerModule,
  ],
  providers: [
    {
      provide: Random,
      useFactory: () => DistinctRandom.number(),
    },
    SeverityColorize,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  public drawer = signal(false);

  constructor(private readonly _recommendation: Recommendation) {}

  public onOpenDrawer(): void {
    this.drawer.update(() => true);
  }

  public onNext(): void {
    this._recommendation.next();
  }

  public onPrev(): void {
    this._recommendation.prev();
  }
}
