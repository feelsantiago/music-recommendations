import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DividerModule } from 'primeng/divider';
import { Tags } from '../domain/tags/tags.service';
import { ColorizedTag } from '../domain/tags/tags.types';
import { SelectedTag } from './domain/selected-tag';
import { RecommendationTagComponent } from './recommendation-tag.component';

@Component({
  selector: 'msc-recommendation-tag-select',
  template: `
    <p-divider align="left">
      <h1>{{ title() }}</h1>
    </p-divider>
    <ng-content></ng-content>
    <div class="overflow-y-auto max-h-100">
      @for (tag of selected(); track tag.data.id) {
        <msc-recommendation-tag
          [selectable]="true"
          [value]="tag.data.name"
          [severity]="tag.data.color"
          [selected]="tag.selected"
          (selectedChange)="onSelectChange(tag)"
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
  public selected: Signal<SelectedTag[]>;
  public selectedChange = output<ColorizedTag[]>();

  constructor(private readonly _tags: Tags) {
    const selected = toSignal(this._tags.selected$, { initialValue: [] });
    this.selected = computed(() => SelectedTag.from(this.tags(), selected()));
  }

  public onSelectChange(tag: SelectedTag): void {
    tag.toggle();

    const selected = this.selected()
      .filter((selectedTag) => selectedTag.selected)
      .map((selectedTag) => selectedTag.data);

    this.selectedChange.emit(selected);
  }
}
