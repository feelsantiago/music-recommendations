import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { match } from 'ts-pattern';
import { Tags } from '../domain/tags/tags.service';
import { GroupedTags, TagSelected, TagType } from '../domain/tags/tags.types';
import { RecommendationTagSelectComponent } from './recommendation-tag-select.component';

@Component({
  selector: 'msc-recommendation-drawer',
  template: `
    <p-drawer
      [(visible)]="open"
      position="right"
      header="Tags"
      styleClass="md:!w-80 lg:!w-[30rem]"
    >
      @if (tags$ | async; as tags) {
        <msc-recommendation-tag-select
          title="Genre"
          [tags]="tags.genre"
          (selectedChange)="onSelectedChange($event, 'genre')"
        />
        <div class="m-10"></div>

        <msc-recommendation-tag-select
          title="Mood"
          [tags]="tags.mood"
          (selectedChange)="onSelectedChange($event, 'mood')"
        />
        <div class="m-10"></div>

        <msc-recommendation-tag-select
          title="Custom"
          [tags]="tags.custom"
          (selectedChange)="onSelectedChange($event, 'custom')"
        >
          <div class="m-2 mb-4 flex items-center gap-2">
            <input
              class="flex-2"
              pSize="small"
              type="text"
              pInputText
              [(ngModel)]="value"
            />
            <p-button
              icon="pi pi-plus"
              size="small"
              severity="contrast"
              aria-label="Save"
            />
          </div>
        </msc-recommendation-tag-select>
      }
    </p-drawer>
  `,
  imports: [
    AsyncPipe,
    FormsModule,
    InputTextModule,
    DrawerModule,
    ButtonModule,
    RecommendationTagSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationDrawerComponnet {
  public open = model(false);
  public value = '';
  public tags$: Observable<GroupedTags>;

  public genre: TagSelected[] = [];
  public mood: TagSelected[] = [];
  public custom: TagSelected[] = [];

  constructor(private readonly _tags: Tags) {
    this.tags$ = this._tags.fetch();

    effect(() => {
      if (!this.open()) {
        this._tags.select([...this.genre, ...this.mood, ...this.custom]);
      }
    });
  }

  public onSelectedChange(selected: TagSelected[], type: TagType): void {
    match(type)
      .with('genre', () => (this.genre = selected))
      .with('mood', () => (this.mood = selected))
      .with('custom', () => (this.custom = selected))
      .exhaustive();
  }
}
