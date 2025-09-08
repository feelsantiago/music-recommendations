import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  Signal,
} from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { match } from 'ts-pattern';
import { SelectedTag, Tag, TagSelected } from '../domain/tags/tags.types';
import { RecommendationTagComponent } from './recommendation-tag.component';

function unselectTags(tag: Tag[]): SelectedTag[] {
  return tag.map((tag) => ({ ...tag, state: 'unselected' }));
}

@Component({
  selector: 'msc-recommendation-tag-select',
  template: `
    <p-divider align="left">
      <h1>{{ title() }}</h1>
    </p-divider>
    <ng-content></ng-content>
    <div class="overflow-y-auto max-h-100">
      @for (tag of tags(); track tag.id) {
        <msc-recommendation-tag [tag]="tag" (tagChange)="onTagChange($event)" />
      }
    </div>
  `,
  imports: [DividerModule, RecommendationTagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagSelectComponent {
  public title = input.required<string>();
  public selected = input<TagSelected[]>([]);
  public unselected = input([], { transform: unselectTags, alias: 'tags' });

  public selectedChange = output<TagSelected[]>();

  public tags: Signal<SelectedTag[]>;

  constructor() {
    this.tags = computed(() => {
      const tags = this.unselected();
      const selected = this.selected();

      return tags.map((unselected) => {
        const _selected = selected.find((tag) => tag.id === unselected.id);
        return _selected || unselected;
      });
    });
  }

  public onTagChange(tag: SelectedTag): void {
    const selected = match(tag)
      .with({ state: 'selected' }, (selected) =>
        this.selected().concat([selected]),
      )
      .with({ state: 'unselected' }, () =>
        this.selected().filter((t) => t.id !== tag.id),
      )
      .exhaustive();

    this.selectedChange.emit(selected);
  }
}
