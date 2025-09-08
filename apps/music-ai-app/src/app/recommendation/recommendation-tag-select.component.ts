import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SeverityColorize } from '@music-ai/components-ui';
import { DistinctRandom, Random } from '@music-ai/random';
import { DividerModule } from 'primeng/divider';
import { match } from 'ts-pattern';
import { Tags } from '../domain/tags/tags.service';
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
        <msc-recommendation-tag [tag]="tag" />
      }
    </div>
  `,
  imports: [DividerModule, RecommendationTagComponent],
  providers: [
    {
      provide: Random,
      useFactory: () => DistinctRandom.number(),
    },
    SeverityColorize,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagSelectComponent {
  public title = input.required<string>();
  public unselected = input([], { transform: unselectTags, alias: 'tags' });

  public selected: Signal<TagSelected[]>;
  public tags: Signal<SelectedTag[]>;

  public selectedChange = output<TagSelected[]>();

  constructor(private readonly _tags: Tags) {
    this.selected = toSignal(this._tags.selected$, { initialValue: [] });
    this.tags = computed(() => {
      const tags = this.unselected();
      const current = this.selected();

      return tags.map((unselected) => {
        const selected = current.find((tag) => tag.id === unselected.id);
        return selected || unselected;
      });
    });
  }

  public onSelectChange(tag: SelectedTag): void {
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
