import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'msc-recommendation-tag',
  template: `
    <p-tag
      class="m-2 cursor-pointer min-h-[27px]"
      [ngClass]="{ 'opacity-50': disabled() }"
      [value]="value()"
      [icon]="icon()"
      [severity]="severity()"
      (click)="pressed.emit()"
    ></p-tag>
  `,
  imports: [CommonModule, ButtonModule, Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagComponent {
  public disabled = input<boolean>(false);
  public severity = input<
    'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast'
  >('secondary');
  public icon = input<string>();
  public value = input('');
  public pressed = output();
}
