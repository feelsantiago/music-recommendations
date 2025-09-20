import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeverityColorize } from '@music-ai/components-ui';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagSelected } from '../../domain/tags/tags.types';

@Component({
  selector: 'msc-tag-custom',
  template: `
    <div class="m-2 mb-4 flex items-center gap-2">
      <input
        class="flex-2"
        pSize="small"
        type="text"
        pInputText
        [(ngModel)]="value"
        (keydown.enter)="onSave()"
      />
      <p-button
        icon="pi pi-plus"
        size="small"
        severity="contrast"
        aria-label="Save"
        (onClick)="onSave()"
      />
    </div>
  `,
  imports: [FormsModule, InputTextModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagCustomComponent {
  public tag = output<TagSelected>();
  public value = '';

  public constructor(private readonly _colorize: SeverityColorize) {}

  public onSave(): void {
    const tag: TagSelected = {
      id: this.value,
      name: this.value,
      type: 'custom',
      state: 'selected',
      severity: 'unset',
    };

    this.value = '';
    this.tag.emit(this._colorize.apply(tag));
  }
}
