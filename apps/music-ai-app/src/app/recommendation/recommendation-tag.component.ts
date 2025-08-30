import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'msc-recommendation-tag',
  template: `<div class="flex flex-wrap flex-gap-2 justify-center items-center">
    @for(tag of tags; track tag.id) {
    <p-tag class="m-2" [value]="tag.name" [severity]="tag.color" />
    }
    <p-button
      styles="height: 28px"
      icon="pi pi-plus"
      size="small"
      severity="contrast"
    ></p-button>
  </div>`,
  styles: [
    `
      :host ::ng-deep .p-button {
        height: 27px;
      }
    `,
  ],
  imports: [Tag, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagComponent {
  public readonly types = ['secondary', 'success', 'info', 'warn', 'danger'];

  public readonly tags = [
    {
      id: 1,
      name: 'Pop',
      type: 'Genre',
      color: 'secondary',
    },
    {
      id: 2,
      name: 'Happy',
      type: 'Mood',
      color: 'success',
    },
    {
      id: 3,
      name: 'Edguy',
      type: 'Custom',
      color: 'info',
    },
    {
      id: 4,
      name: 'Sad',
      type: 'Mood',
      color: 'warn',
    },
    {
      id: 5,
      name: 'Rap',
      type: 'Genre',
      color: 'danger',
    },
    {
      id: 6,
      name: 'Power Metal',
      type: 'Genre',
      color: 'success',
    },
  ];
}
