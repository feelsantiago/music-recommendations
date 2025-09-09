import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SeverityColorize,
  SliderComponent,
  SliderItemDirective,
} from '@music-ai/components-ui';
import { DistinctRandom, Random } from '@music-ai/random';
import { DrawerModule } from 'primeng/drawer';
import { forkJoin, map } from 'rxjs';
import { CustomTags } from '../domain/custom/custom-tags.service';
import { Tags } from '../domain/tags/tags.service';
import { GroupedTags, TagSelected } from '../domain/tags/tags.types';
import { RecommnedationControlsComponent } from './recommendation-controls.component';
import { RecommendationDrawerComponnet } from './recommendation-drawer.component';
import { RecommendationItemComponent } from './recommendation-item.component';
import { RecommendationTagListComponent } from './recommendation-tag-list.component';
import { RecommendationTypeComponent } from './recommendation-type.component';

@Component({
  selector: 'msc-recommendation',
  template: `
    <msc-recommendation-drawer
      title="Choose..."
      [tags]="tags()"
      [(open)]="drawer"
      [selected]="selected()"
      (selectedChange)="onSelectedChange($event)"
    />
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
        [tags]="selected()"
        (add)="onAdd()"
        (tagsChange)="onSelectedChange($event)"
      ></msc-recommendation-tag-list>
    </div>
    <div class="mt-10">
      <msc-recommendation-controls
        (prev)="onPrev()"
        (next)="onNext()"
      ></msc-recommendation-controls>
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
  providers: [
    {
      provide: Random,
      useFactory: () => DistinctRandom.number(),
    },
    SeverityColorize,
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
  public tags: Signal<GroupedTags>;
  public selected: Signal<TagSelected[]>;

  private readonly _slider = viewChild.required(SliderComponent);

  constructor(
    private readonly _tags: Tags,
    private readonly _custom: CustomTags,
  ) {
    const tags$ = forkJoin({
      tags: this._tags.fetch(),
      custom: this._custom.load(),
    }).pipe(map(({ tags, custom }) => ({ ...tags, custom })));

    this.tags = toSignal(tags$, {
      initialValue: { genre: [], mood: [], custom: [] },
    });
    this.selected = toSignal(this._tags.selected$, { initialValue: [] });
  }

  public onAdd(): void {
    this.drawer.update(() => true);
  }

  public onSelectedChange(tags: TagSelected[]): void {
    this._tags.select(tags);
  }

  public onNext(): void {
    this._slider().next();
  }

  public onPrev(): void {
    this._slider().prev();
  }
}
