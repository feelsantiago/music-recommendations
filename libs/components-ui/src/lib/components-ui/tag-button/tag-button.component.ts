import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { Tag } from 'primeng/tag';
import { Severity } from '../severity';

@Component({
  selector: 'msc-ui-tag-button',
  template: `
    <span (contextmenu)="onContextMenu($event)">
      <p-tag
        class="m-2 cursor-pointer min-h-[27px]"
        [ngClass]="{ 'opacity-50': disabled() }"
        [value]="value()"
        [icon]="icon()"
        [severity]="severity()"
        (click)="pressed.emit()"
      >
      </p-tag>
      <p-contextmenu appendTo="body" [model]="items" />
    </span>
  `,
  imports: [CommonModule, ContextMenuModule, Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagButtonComponent {
  public disabled = input(false);
  public value = input<string>('');
  public icon = input<string>('');
  public removable = input(false);
  public severity = input<Severity>('unset');

  public pressed = output<void>();
  public removed = output<void>();

  public cm = viewChild.required(ContextMenu);

  public items = [
    {
      label: 'Remove',
      icon: 'pi pi-times',
      command: () => {
        this.removed.emit();
      },
    },
  ];

  public onContextMenu(event: Event): void {
    if (this.removable()) {
      this.cm().show(event);
    }
  }
}
