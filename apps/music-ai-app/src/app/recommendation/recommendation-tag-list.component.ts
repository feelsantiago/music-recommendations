import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Observable } from 'rxjs';
import { Tags } from '../domain/tags/tags.service';
import { ColorizedTag } from '../domain/tags/tags.types';
import { RecommendationTagComponent } from './recommendation-tag.component';

type MaxTagList = number;

@Component({
  selector: 'msc-recommendation-tag-list',
  template: `<div class="flex flex-wrap flex-gap-2 justify-center items-center">
    @let tags = (tags$ | async) ?? [];

    @for (tag of tags; track tag.id) {
      <msc-recommendation-tag [value]="tag.name" [severity]="tag.color" />
    }

    @if (tags.length > max) {
      <msc-recommendation-tag value="..." [severity]="'danger'" />
    }

    <msc-recommendation-tag
      type="button"
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
  imports: [RecommendationTagComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagListComponent {
  public readonly max: MaxTagList = 8;
  public tags$: Observable<ColorizedTag[]>;

  public add = output();

  constructor(private readonly _tags: Tags) {
    this.tags$ = this._tags.selected$;
  }
}
