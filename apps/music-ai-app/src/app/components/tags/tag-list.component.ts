import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TagButtonComponent } from '@music-ai/components-ui';
import { Tags } from '../../domain/tags/tags.service';
import { TagSelected } from '../../domain/tags/tags.types';
import { TagComponent } from './tag.component';

type MaxTagList = number;

@Component({
  selector: 'msc-tag-list',
  template: `<div class="flex flex-wrap flex-gap-2 justify-center items-center">
    @for (tag of slice(); track tag.id) {
      <msc-tag [tag]="tag" (tagChange)="onTagChange(tag)" />
    }

    @if (selected().length > max) {
      <msc-ui-tag-button value="..." [severity]="'danger'" />
    }

    <msc-ui-tag-button
      icon="pi pi-plus"
      [severity]="'contrast'"
      (pressed)="selectTag.emit()"
    />
  </div>`,
  styles: [
    `
      :host ::ng-deep .p-tag-icon {
        padding-left: 2px !important;
      }
    `,
  ],
  imports: [TagComponent, TagButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent {
  public readonly max: MaxTagList = 6;
  public readonly selected: Signal<TagSelected[]>;
  public readonly slice: Signal<TagSelected[]>;

  public selectTag = output();

  constructor(private readonly _tags: Tags) {
    this.selected = toSignal(this._tags.selected$, { initialValue: [] });
    this.slice = computed(() => this.selected().slice(0, this.max));
  }

  public onTagChange(tag: TagSelected): void {
    this._tags.unselect(tag);
  }
}
