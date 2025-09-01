import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { RecommendationTagComponent } from './recommendation-tag.component';

interface TagItem {
  id: number;
  name: string;
  disabled: boolean;
  color: 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';
}

@Component({
  selector: 'msc-recommendation-tag-select',
  template: `
    <p-divider align="left">
      <h1>{{ title() }}</h1>
    </p-divider>
    @for(tag of tags(); track tag.id) {
    <msc-recommendation-tag
      [disabled]="tag.disabled"
      [value]="tag.name"
      [severity]="tag.color"
    />
    }
  `,
  imports: [DividerModule, RecommendationTagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagSelectComponent {
  public title = input.required<string>();
  public tags = input<TagItem[]>([]);
}
