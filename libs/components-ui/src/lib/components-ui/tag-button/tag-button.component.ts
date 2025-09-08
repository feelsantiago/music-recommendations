import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Tag } from 'primeng/tag';
import { Severity } from '../severity';

@Component({
  selector: 'msc-ui-tag-button',
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
  imports: [CommonModule, Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagButtonComponent {
  public disabled = input(false);
  public value = input<string>('');
  public icon = input<string>('');
  public severity = input<Severity>();
  public pressed = output<void>();
}
