import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SliderComponent, SliderItemDirective } from '@music-ai/components-ui';
import { DrawerModule } from 'primeng/drawer';
import { RecommnedationControlsComponent } from './recommendation-controls.component';
import { RecommendationDrawerComponnet } from './recommendation-drawer.component';
import { RecommendationItemComponent } from './recommendation-item.component';
import { RecommendationTagListComponent } from './recommendation-tag-list.component';
import { RecommendationTypeComponent } from './recommendation-type.component';

@Component({
  selector: 'msc-recommendation',
  template: `
    <msc-recommendation-drawer title="Choose..." [(open)]="drawer" />
    <msc-recommendation-type></msc-recommendation-type>
    <msc-ui-slider>
      @for (recommendation of recommendations; track recommendation.id) {
        <msc-recommendation-item [item]="recommendation.id" mscUiSliderItem>
          {{ recommendation.id }}
        </msc-recommendation-item>
      }
    </msc-ui-slider>
    <div class="mt-10">
      <msc-recommendation-tag-list
        (add)="onAdd()"
      ></msc-recommendation-tag-list>
    </div>
    <div class="mt-10">
      <msc-recommendation-controls></msc-recommendation-controls>
    </div>
  `,
  imports: [
    RecommendationDrawerComponnet,
    RecommendationTypeComponent,
    RecommendationItemComponent,
    RecommendationTagListComponent,
    RecommnedationControlsComponent,
    DrawerModule,
    SliderComponent,
    SliderItemDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationComponent {
  public recommendations = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ];

  public drawer = signal(false);

  public onAdd(): void {
    this.drawer.update(() => true);
  }
}
