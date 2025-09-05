import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { Severity } from '../domain/theme/theme.types';

export type TagSelectState = 'selected' | 'deselected';

@Component({
  selector: 'msc-recommendation-tag',
  template: `
    <p-tag
      class="m-2 cursor-pointer min-h-[27px]"
      [ngClass]="{ 'opacity-50': !selected() }"
      [value]="value()"
      [icon]="icon()"
      [severity]="severity()"
      (click)="onClick()"
    ></p-tag>
  `,
  imports: [CommonModule, ButtonModule, Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagComponent {
  public selectable = input<boolean>(false);
  public severity = input<Severity>('secondary');
  public icon = input<string>();
  public value = input('');
  public selected = model<boolean>(true);
  public pressed = output();

  public onClick(): void {
    if (this.selectable()) {
      this.selected.update((value) => !value);
    }

    this.pressed.emit();
  }
}
