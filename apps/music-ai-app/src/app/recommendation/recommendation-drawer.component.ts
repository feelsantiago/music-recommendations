import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { Observable, map } from 'rxjs';
import { DistinctRandom, Random } from '../domain/random/random';
import { Tags } from '../domain/tags/tags.service';
import { GoupredColorizedTags } from '../domain/tags/tags.types';
import { SeverityColorize } from '../domain/theme/colorize';
import { RecommendationTagSelectComponent } from './recommendation-tag-select.component';

@Component({
  selector: 'msc-recommendation-drawer',
  template: `
    <p-drawer
      [(visible)]="open"
      position="right"
      [header]="title()"
      styleClass="md:!w-80 lg:!w-[30rem]"
    >
      @if (tags$ | async; as tags) {
        <msc-recommendation-tag-select title="Genre" [tags]="tags.genre" />
        <div class="m-10"></div>

        <msc-recommendation-tag-select title="Mood" [tags]="tags.mood" />
        <div class="m-10"></div>

        <msc-recommendation-tag-select title="Custom" [tags]="tags.custom">
          <div class="m-2 mb-4 flex items-center gap-2">
            <input
              class="flex-2"
              pSize="small"
              type="text"
              pInputText
              [(ngModel)]="value"
            />
            <p-button
              icon="pi pi-arrow-right"
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
  providers: [
    {
      provide: Random,
      useFactory: () => DistinctRandom.create(),
    },
    SeverityColorize,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationDrawerComponnet {
  public open = model(false);
  public title = input('');
  public value = '';

  public tags$: Observable<GoupredColorizedTags>;

  constructor(
    private readonly _tags: Tags,
    private readonly _colorize: SeverityColorize,
  ) {
    this.tags$ = this._tags.fetch().pipe(
      map((tags) => ({
        genre: tags.genre.map((tag) => this._colorize.apply(tag)),
        mood: tags.mood.map((tag) => this._colorize.apply(tag)),
        custom: tags.custom.map((tag) => this._colorize.apply(tag)),
      })),
    );
  }
}
