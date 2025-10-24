import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Toolbar } from 'primeng/toolbar';
import { Tutorial } from '../domain/tutorial/tutorial.service';

@Component({
  selector: 'msc-header',
  template: `
    <p-card>
      <p-toolbar>
        <ng-template #start>
          <img
            ngSrc="logo.png"
            width="50"
            height="50"
            alt="music ai logo"
            priority
          />
        </ng-template>
        <ng-template #end>
          <p-button
            [style]="{ width: '42px', height: '34px' }"
            icon="pi pi-question-circle"
            severity="secondary"
            class="mr-2"
            (onClick)="onTutorial()"
          />
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
  styles: [
    `
      :host ::ng-deep .p-card {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
    `,
  ],
  imports: [CommonModule, Toolbar, ButtonModule, CardModule, NgOptimizedImage],
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

  constructor(private readonly _tutorial: Tutorial) {}

  public onTutorial(): void {
    this._tutorial.update(true);
  }
}
