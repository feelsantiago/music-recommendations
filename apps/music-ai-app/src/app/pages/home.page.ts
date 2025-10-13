import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SeverityColorize } from '@music-ai/components-ui';
import { DistinctRandom, Random } from '@music-ai/random';
import { DrawerModule } from 'primeng/drawer';
import { RecommnedationControlsComponent } from '../components/recommendation/recommendation-controls.component';
import { RecommendationSettingsComponent } from '../components/recommendation/recommendation-settings.component';
import { RecommendationTypeComponent } from '../components/recommendation/recommendation-type.component';
import { RecommendationComponent } from '../components/recommendation/recommendation.component';
import { TagDrawerComponnet } from '../components/tags/tag-drawer.component';
import { TagListComponent } from '../components/tags/tag-list.component';

@Component({
  selector: 'msc-home',
  template: `
    <div class="max-w-120 mx-auto">
      <msc-tag-drawer [(open)]="drawer" />
      <msc-recommendation-type />
      <div class="mt-5"></div>
      <msc-recommendation />
      <div class="mt-10">
        <msc-tag-list (selectTag)="onOpenDrawer()" />
      </div>
      <div class="mt-5">
        <msc-recommendation-controls />
      </div>
      <div class="mt-5">
        <msc-recommendation-settings />
      </div>
    </div>
  `,
  imports: [
    TagDrawerComponnet,
    TagListComponent,
    RecommendationComponent,
    RecommendationTypeComponent,
    RecommnedationControlsComponent,
    RecommendationSettingsComponent,
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

  public onOpenDrawer(): void {
    this.drawer.update(() => true);
  }
}
