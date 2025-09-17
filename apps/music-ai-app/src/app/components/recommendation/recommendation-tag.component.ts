import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  model,
  output,
  Signal,
  SkipSelf,
} from '@angular/core';
import {
  Severity,
  SeverityColorize,
  TagButtonComponent,
} from '@music-ai/components-ui';
import { match } from 'ts-pattern';
import { SelectedTag } from '../../domain/tags/tags.types';

@Component({
  selector: 'msc-recommendation-tag',
  template: `
    <msc-ui-tag-button
      [disabled]="!selected()"
      [value]="tag().name"
      [severity]="severity()"
      [removable]="removable()"
      (click)="onClick()"
      (removed)="removed.emit(tag())"
    ></msc-ui-tag-button>
  `,
  imports: [CommonModule, TagButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagComponent {
  public tag = model.required<SelectedTag>();
  public removable = input(false);
  public severity: Signal<Severity>;
  public selected: Signal<boolean>;
  public removed = output<SelectedTag>();

  constructor(@SkipSelf() private readonly _colorize: SeverityColorize) {
    this.severity = linkedSignal({
      source: this.tag,
      computation: (source, prev) => {
        const severity = prev?.value || source.severity;
        const tag = match(severity)
          .with('unset', () => this._colorize.apply(source))
          .otherwise(() => ({ ...source, severity }));

        return tag.severity;
      },
    });

    this.selected = computed(() => this.tag().state === 'selected');
  }

  public onClick(): void {
    const severity = this.severity();
    this.tag.update((tag) =>
      match<SelectedTag['state'], SelectedTag>(tag.state)
        .with('selected', () => ({ ...tag, severity, state: 'unselected' }))
        .with('unselected', () => ({ ...tag, severity, state: 'selected' }))
        .exhaustive(),
    );
  }
}
