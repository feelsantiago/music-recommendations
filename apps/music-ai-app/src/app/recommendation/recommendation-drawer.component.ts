import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RecommendationTagSelectComponent } from './recommendation-tag-select.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'msc-recommendation-drawer',
  template: `
    <p-drawer [(visible)]="open" position="right" [header]="title()">
      <msc-recommendation-tag-select title="Genre" [tags]="genres" />
      <div class="m-10"></div>

      <msc-recommendation-tag-select title="Mood" [tags]="moods" />
      <div class="m-10"></div>

      <msc-recommendation-tag-select title="Custom" [tags]="custom">
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
      <div class="m-10"></div>

      <p-button
        [fluid]="true"
        label="Save"
        severity="contrast"
        (onClick)="open.set(false)"
      />
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
  public title = input('');
  public value = '';

  public genres = [
    {
      id: 1,
      name: 'Pop',
      color: 'secondary' as const,
      disabled: true,
    },
    {
      id: 2,
      name: 'Happy',
      color: 'success' as const,
      disabled: true,
    },
    {
      id: 3,
      name: 'Edguy',
      color: 'info' as const,
      disabled: false,
    },
    {
      id: 4,
      name: 'Sad',
      color: 'warn' as const,
      disabled: false,
    },
    {
      id: 5,
      name: 'Dance',
      color: 'danger' as const,
      disabled: true,
    },
  ];

  public moods = [
    {
      id: 1,
      name: 'Happy',
      color: 'success' as const,
      disabled: true,
    },
    {
      id: 2,
      name: 'Eletric',
      color: 'info' as const,
      disabled: true,
    },
    {
      id: 3,
      name: 'Sad',
      color: 'warn' as const,
      disabled: true,
    },
    {
      id: 4,
      name: 'Dance',
      color: 'danger' as const,
      disabled: false,
    },
  ];

  public custom = [
    {
      id: 1,
      name: 'Custom 1',
      color: 'secondary' as const,
      disabled: true,
    },
    {
      id: 2,
      name: 'Custom 2',
      color: 'success' as const,
      disabled: true,
    },
    {
      id: 3,
      name: 'Custom 3',
      color: 'info' as const,
      disabled: false,
    },
  ];
}
