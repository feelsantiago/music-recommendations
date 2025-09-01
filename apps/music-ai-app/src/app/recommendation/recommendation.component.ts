import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { SliderComponent } from '../slider/slider.component';
import { SliderItemDirective } from '../slider/slider-item.directive';
import { RecommendationItemComponent } from './recommendation-item.component';
import { RecommendationTagListComponent } from './recommendation-tag-list.component';
import { RecommnedationControlsComponent } from './recommendation-controls.component';
import { RecommendationTypeComponent } from './recommendation-type.component';
import { RecommendationDrawerComponnet } from './recommendation-drawer.component';

@Component({
  selector: 'msc-recommendation',
  template: `
    <msc-recommendation-drawer title="Choose..." [(open)]="drawer" />
    <msc-recommendation-type></msc-recommendation-type>
    <msc-slider>
      @for(recommendation of recommendations; track recommendation.id) {
      <msc-recommendation-item [item]="recommendation.id" mscSliderItem>
        {{ recommendation.id }}
      </msc-recommendation-item>
      }
    </msc-slider>
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
