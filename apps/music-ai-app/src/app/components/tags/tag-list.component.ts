import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TagButtonComponent } from '@music-ai/components-ui';
import { RxPush } from '@rx-angular/template/push';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Observable } from 'rxjs';
import { Loader } from '../../domain/loader/loader.service';
import { Tags } from '../../domain/tags/tags.service';
import { TagSelected } from '../../domain/tags/tags.types';
import { TagComponent } from './tag.component';

type MaxTagList = number;

@Component({
  selector: 'msc-tag-list',
  template: `<div class="flex flex-wrap flex-gap-2 justify-center items-center">
    @for (tag of tags(); track tag.id) {
      <msc-tag [tag]="tag" (tagChange)="onTagChange(tag)" />
    }

    @if (selected().length > max) {
      <msc-ui-tag-button value="..." [severity]="'danger'" />
    }

    @if (loading$ | push) {
      <div class="card flex justify-center">
        <p-progress-spinner
          strokeWidth="6"
          fill="transparent"
          animationDuration=".5s"
          [style]="{ width: '32px', height: '32px' }"
        />
      </div>
    } @else {
      <msc-ui-tag-button
        icon="pi pi-plus"
        [severity]="'contrast'"
        (pressed)="selectTag.emit()"
      />
    }
  </div>`,
  styles: [
    `
      :host ::ng-deep .p-tag-icon {
        padding-left: 2px !important;
      }
    `,
  ],
  imports: [TagComponent, TagButtonComponent, ProgressSpinner, RxPush],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent {
  public readonly max: MaxTagList = 6;
  public readonly selected: Signal<TagSelected[]>;
  public readonly tags: Signal<TagSelected[]>;

  public selectTag = output();
  public loading$: Observable<boolean>;

  constructor(
    private readonly _tags: Tags,
    private readonly _loader: Loader,
  ) {
    this.selected = toSignal(this._tags.selected$, { initialValue: [] });
    this.tags = computed(() => this.selected().slice(0, this.max));
    this.loading$ = this._loader.loading$;
  }

  public onTagChange(tag: TagSelected): void {
    this._tags.unselect(tag);
  }
}
