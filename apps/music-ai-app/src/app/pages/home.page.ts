import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SeverityColorize } from '@music-ai/components-ui';
import { DistinctRandom, Random } from '@music-ai/random';
import { RxPush } from '@rx-angular/template/push';
import { DrawerModule } from 'primeng/drawer';
import { GalleriaModule } from 'primeng/galleria';
import { Observable } from 'rxjs';
import { RecommnedationControlsComponent } from '../components/recommendation/recommendation-controls.component';
import { RecommendationSettingsComponent } from '../components/recommendation/recommendation-settings.component';
import { RecommendationTypeComponent } from '../components/recommendation/recommendation-type.component';
import { RecommendationComponent } from '../components/recommendation/recommendation.component';
import { TagDrawerComponnet } from '../components/tags/tag-drawer.component';
import { TagListComponent } from '../components/tags/tag-list.component';
import { Tutorial, TutorialImage } from '../domain/tutorial/tutorial.service';

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
    @if (tutorial$ | push; as visible) {
      <p-galleria
        [value]="images$ | push"
        [visible]="visible"
        [containerStyle]="{ 'max-width': '850px' }"
        [responsiveOptions]="responsiveOptions"
        [circular]="true"
        [fullScreen]="true"
        [showIndicators]="true"
        [showItemNavigators]="true"
        [showThumbnails]="false"
        [autoPlay]="true"
        [transitionInterval]="5000"
        [(activeIndex)]="index"
        (visibleChange)="onVisibilityChange($event)"
      >
        <ng-template #item let-item>
          <img [src]="item.url" class="w-full block" />
        </ng-template>
        <ng-template #caption let-item>
          <p class="text-white">{{ item.description }}</p>
        </ng-template>
      </p-galleria>
    }
  `,
  imports: [
    TagDrawerComponnet,
    TagListComponent,
    RecommendationComponent,
    RecommendationTypeComponent,
    RecommnedationControlsComponent,
    RecommendationSettingsComponent,
    DrawerModule,
    GalleriaModule,
    RxPush,
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
  public images$: Observable<TutorialImage[]>;
  public tutorial$: Observable<boolean>;
  public index = signal(0);

  public responsiveOptions = [
    {
      breakpoint: '1500px',
      numVisible: 5,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  constructor(private readonly _tutorial: Tutorial) {
    this.images$ = this._tutorial.images;
    this.tutorial$ = this._tutorial.enabled;
  }

  public onOpenDrawer(): void {
    this.drawer.update(() => true);
  }

  public onVisibilityChange(visible: boolean): void {
    this._tutorial.update(visible);
  }
}
