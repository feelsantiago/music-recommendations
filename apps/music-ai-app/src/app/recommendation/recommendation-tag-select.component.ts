import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ColorizedTag } from '../domain/tags/tags.types';
import { RecommendationTagComponent } from './recommendation-tag.component';

@Component({
  selector: 'msc-recommendation-tag-select',
  template: `
    <p-divider align="left">
      <h1>{{ title() }}</h1>
    </p-divider>
    <ng-content></ng-content>
    <div class="overflow-y-auto max-h-100">
      @for (tag of tags(); track tag.id) {
        <msc-recommendation-tag
          [disabled]="false"
          [value]="tag.name"
          [severity]="tag.color"
        />
      }
    </div>
  `,
  imports: [DividerModule, RecommendationTagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagSelectComponent {
  public title = input.required<string>();
  public tags = input<ColorizedTag[]>([]);
}
