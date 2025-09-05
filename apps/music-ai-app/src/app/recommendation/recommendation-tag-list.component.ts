import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tags } from '../domain/tags/tags.service';
import { ColorizedTag } from '../domain/tags/tags.types';
import { RecommendationTagComponent } from './recommendation-tag.component';

type MaxTagList = number;

@Component({
  selector: 'msc-recommendation-tag-list',
  template: `<div class="flex flex-wrap flex-gap-2 justify-center items-center">
    @for (tag of slice(); track tag.id) {
      <msc-recommendation-tag
        [value]="tag.name"
        [severity]="tag.color"
        (pressed)="onPressed(tag)"
      />
    }

    @if (tags().length > max) {
      <msc-recommendation-tag value="..." [severity]="'danger'" />
    }

    <msc-recommendation-tag
      type="button"
      icon="pi pi-plus"
      [severity]="'contrast'"
      [selectable]="false"
      (pressed)="add.emit()"
    />
  </div>`,
  styles: [
    `
      :host ::ng-deep .p-tag-icon {
        padding-left: 2px !important;
      }
    `,
  ],
  imports: [RecommendationTagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagListComponent {
  public readonly max: MaxTagList = 6;
  public readonly tags: Signal<ColorizedTag[]>;
  public readonly slice: Signal<ColorizedTag[]>;

  public add = output();

  constructor(private readonly _tags: Tags) {
    this.tags = toSignal(this._tags.selected$, { initialValue: [] });
    this.slice = computed(() => this.tags().slice(0, this.max));
  }

  public onPressed(tag: ColorizedTag): void {
    console.log(tag);
    const selected = this.tags().filter(
      (selectedTag) => selectedTag.name !== tag.name,
    );
    this._tags.select(selected);
  }
}
