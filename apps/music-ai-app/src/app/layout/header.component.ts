import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'msc-header',
  template: `
    <p-card>
      <p-toolbar>
        <ng-template #start>
          <p-button
            icon="pi pi-headphones"
            text
            severity="secondary"
          ></p-button>
          <h1>Music AI</h1>
        </ng-template>
        <ng-template #end>
          @for (link of links; track link.url) {
            <a
              class="mr-2"
              [href]="link.url"
              pButton
              target="_blank"
              severity="secondary"
              rel="noopener noreferrer"
            >
              <i [ngClass]="link.icon"></i>
            </a>
          }
        </ng-template>
      </p-toolbar>
    </p-card>
  `,
  imports: [CommonModule, Toolbar, ButtonModule, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public links = [
    {
      url: 'https://www.linkedin.com/in/filipe-santiago-508676136/',
      icon: 'pi pi-linkedin',
    },
    {
      url: 'https://x.com/feelssantiago',
      icon: 'pi pi-twitter',
    },
    {
      url: 'https://github.com/feelsantiago/music-recommendations',
      icon: 'pi pi-github',
    },
  ];
}
