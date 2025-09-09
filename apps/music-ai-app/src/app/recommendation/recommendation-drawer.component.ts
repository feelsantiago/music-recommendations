import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { Observable, startWith } from 'rxjs';
import { match } from 'ts-pattern';
import { CustomTags } from '../domain/custom/custom-tags.service';
import {
  GroupedTags,
  Tag,
  TagSelected,
  TagType,
} from '../domain/tags/tags.types';
import { RecommendationCustomComponent } from './recommendation-custom.component';
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
        [tags]="(custom$ | async) || []"
        [selected]="custom()"
        [removable]="true"
        (removed)="onCustomRemoved($event)"
        (selectedChange)="onSelectedChange($event, 'custom')"
      >
        <msc-recommendation-custom
          (tag)="onCustomTag($event)"
        ></msc-recommendation-custom>
      </msc-recommendation-tag-select>
    </p-drawer>
  `,
  imports: [
    AsyncPipe,
    DrawerModule,
    RecommendationTagSelectComponent,
    RecommendationCustomComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationDrawerComponnet implements OnInit {
  public open = model(false);
  public tags = input.required<GroupedTags>();
  public selected = input<TagSelected[]>([]);

  public selectedChange = output<TagSelected[]>();

  public custom$!: Observable<Tag[]>;
  public genre: WritableSignal<TagSelected[]> = signal([]);
  public mood: WritableSignal<TagSelected[]> = signal([]);
  public custom: WritableSignal<TagSelected[]> = signal([]);

  constructor(private readonly _custom: CustomTags) {
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

  public ngOnInit(): void {
    this.custom$ = this._custom.tags$.pipe(startWith(this.tags().custom));
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

  public onCustomTag(tag: TagSelected): void {
    this._custom.save(tag);
    this.custom.update((tags) => [...tags, tag]);
  }

  public onCustomRemoved(tag: Tag): void {
    this._custom.remove(tag);
    this.custom.update((tags) => tags.filter((t) => t.name !== tag.name));
  }
}
