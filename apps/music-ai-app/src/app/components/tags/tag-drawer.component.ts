import {
  ChangeDetectionStrategy,
  Component,
  effect,
  model,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tag, TagType } from '@music-ai/tags';
import { RxLet } from '@rx-angular/template/let';
import { DrawerModule } from 'primeng/drawer';
import { Observable } from 'rxjs';
import { match } from 'ts-pattern';
import { CustomTags } from '../../domain/custom/custom-tags.service';
import { Tags } from '../../domain/tags/tags.service';
import { TagGroupedColorful, TagSelected } from '../../domain/tags/tags.types';
import { TagCustomComponent } from './tag-custom.component';
import { TagSelectComponent } from './tag-select.component';

@Component({
  selector: 'msc-tag-drawer',
  template: `
    <ng-container *rxLet="tags$; let tags">
      <p-drawer
        [(visible)]="open"
        (onHide)="onHide()"
        position="right"
        header="Tags"
        styleClass="md:!w-80 lg:!w-[30rem]"
      >
        <msc-tag-select
          title="Genre"
          [tags]="tags.genre"
          [selected]="genre()"
          (selectedChange)="onSelectedChange($event, 'genre')"
        />
        <div class="m-10"></div>

        <msc-tag-select
          title="Mood"
          [tags]="tags.mood"
          [selected]="mood()"
          (selectedChange)="onSelectedChange($event, 'mood')"
        />
        <div class="m-10"></div>

        <msc-tag-select
          title="Custom"
          [tags]="tags.custom"
          [selected]="custom()"
          [removable]="true"
          (removed)="onCustomRemoved($event)"
          (selectedChange)="onSelectedChange($event, 'custom')"
        >
          <msc-tag-custom (tag)="onCustomTag($event)"></msc-tag-custom>
        </msc-tag-select>
      </p-drawer>
    </ng-container>
  `,
  imports: [DrawerModule, TagCustomComponent, TagSelectComponent, RxLet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagDrawerComponnet {
  public open = model(false);

  public tags$: Observable<TagGroupedColorful>;
  public selected: Signal<TagSelected[]>;

  public genre: WritableSignal<TagSelected[]> = signal([]);
  public mood: WritableSignal<TagSelected[]> = signal([]);
  public custom: WritableSignal<TagSelected[]> = signal([]);

  constructor(
    private readonly _custom: CustomTags,
    private readonly _tags: Tags,
  ) {
    this.tags$ = this._tags.tags$;
    this.selected = toSignal(this._tags.selected$, { initialValue: [] });

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
    this._tags.select([...this.genre(), ...this.mood(), ...this.custom()]);
  }

  public onSelectedChange(tags: TagSelected[], type: TagType): void {
    match(type)
      .with('genre', () => this.genre.update(() => tags))
      .with('mood', () => this.mood.update(() => tags))
      .with('custom', () => this.custom.update(() => tags))
      .exhaustive();
  }

  public onCustomTag(tag: TagSelected): void {
    this.custom.update((tags) => [...tags, tag]);
    this._custom.save(tag);
  }

  public onCustomRemoved(tag: Tag): void {
    this.custom.update((tags) => tags.filter((t) => t.name !== tag.name));
    this._custom.remove(tag);
  }
}
