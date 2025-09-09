import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { match } from 'ts-pattern';
import { GroupedTags, TagSelected, TagType } from '../domain/tags/tags.types';
import { RecommendationTagSelectComponent } from './recommendation-tag-select.component';

@Component({
  selector: 'msc-recommendation-drawer',
  template: `
    <p-drawer
      [(visible)]="open"
      (onHide)="onHide()"
      position="right"
      header="Tags"
      styleClass="md:!w-80 lg:!w-[30rem]"
    >
      <msc-recommendation-tag-select
        title="Genre"
        [tags]="tags().genre"
        [selected]="genre()"
        (selectedChange)="onSelectedChange($event, 'genre')"
      />
      <div class="m-10"></div>

      <msc-recommendation-tag-select
        title="Mood"
        [tags]="tags().mood"
        [selected]="mood()"
        (selectedChange)="onSelectedChange($event, 'mood')"
      />
      <div class="m-10"></div>

      <msc-recommendation-tag-select
        title="Custom"
        [tags]="tags().custom"
        [selected]="custom()"
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
    </p-drawer>
  `,
  imports: [
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
  public tags = input.required<GroupedTags>();
  public selected = input<TagSelected[]>([]);

  public selectedChange = output<TagSelected[]>();

  public value = '';
  public genre: WritableSignal<TagSelected[]> = signal([]);
  public mood: WritableSignal<TagSelected[]> = signal([]);
  public custom: WritableSignal<TagSelected[]> = signal([]);

  constructor() {
    effect(() => {
      const selected = this.selected();
      const genre = selected.filter((tag) => tag.type === 'genre');
      const mood = selected.filter((tag) => tag.type === 'mood');
      const custom = selected.filter((tag) => tag.type === 'custom');

      this.genre.update(() => genre);
      this.mood.update(() => mood);
      this.custom.update(() => custom);
    });
  }

  public onHide(): void {
    this.selectedChange.emit([
      ...this.genre(),
      ...this.mood(),
      ...this.custom(),
    ]);
  }

  public onSelectedChange(tags: TagSelected[], type: TagType): void {
    match(type)
      .with('genre', () => this.genre.update(() => tags))
      .with('mood', () => this.mood.update(() => tags))
      .with('custom', () => this.custom.update(() => tags))
      .exhaustive();
  }
}
