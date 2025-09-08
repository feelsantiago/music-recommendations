import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  output,
  Signal,
} from '@angular/core';
import { TagButtonComponent } from '@music-ai/components-ui';
import { TagSelected } from '../domain/tags/tags.types';
import { RecommendationTagComponent } from './recommendation-tag.component';

type MaxTagList = number;

@Component({
  selector: 'msc-recommendation-tag-list',
  template: `<div class="flex flex-wrap flex-gap-2 justify-center items-center">
    @for (tag of slice(); track tag.id) {
      <msc-recommendation-tag [tag]="tag" (tagChange)="onTagChange(tag)" />
    }

    @if (tags().length > max) {
      <msc-ui-tag-button value="..." [severity]="'danger'" />
    }

    <msc-ui-tag-button
      icon="pi pi-plus"
      [severity]="'contrast'"
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
  imports: [RecommendationTagComponent, TagButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagListComponent {
  public readonly max: MaxTagList = 6;
  public readonly tags = model<TagSelected[]>([]);
  public readonly slice: Signal<TagSelected[]>;

  public add = output();

  constructor() {
    this.slice = computed(() => this.tags().slice(0, this.max));
  }

  public onTagChange(tag: TagSelected): void {
    const selected = this.tags().filter(
      (selectedTag) => selectedTag.name !== tag.name,
    );

    this.tags.update(() => selected);
  }
}
