import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { RecommendationTagComponent } from './recommendation-tag.component';

@Component({
  selector: 'msc-recommendation-tag-list',
  template: `<div class="flex flex-wrap flex-gap-2 justify-center items-center">
    @for(tag of tags; track tag.id) {
    <msc-recommendation-tag [value]="tag.name" [severity]="tag.color" />
    }
    <msc-recommendation-tag value="..." [severity]="'danger'" />
    <msc-recommendation-tag
      type="button"
      icon="pi pi-plus"
      [severity]="'contrast'"
      (pressed)="add.emit()"
    />
  </div>`,
  imports: [RecommendationTagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationTagListComponent {
  public readonly types = ['secondary', 'success', 'info', 'warn', 'danger'];
  public add = output();

  public readonly tags = [
    {
      id: 1,
      name: 'Pop',
      type: 'Genre',
      color: 'secondary' as const,
    },
    {
      id: 2,
      name: 'Happy',
      type: 'Mood',
      color: 'success' as const,
    },
    {
      id: 3,
      name: 'Edguy',
      type: 'Custom',
      color: 'info' as const,
    },
    {
      id: 4,
      name: 'Sad',
      type: 'Mood',
      color: 'warn' as const,
    },
    {
      id: 5,
      name: 'Rap',
      type: 'Genre',
      color: 'danger' as const,
    },
    {
      id: 6,
      name: 'Power Metal',
      type: 'Genre',
      color: 'success' as const,
    },
  ];
}
