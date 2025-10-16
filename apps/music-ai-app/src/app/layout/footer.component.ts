import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

interface FooterLink {
  icon: string;
  url: string;
  alt: string;
  tooltip: string;
}

@Component({
  selector: 'msc-footer-icon',
  template: `
    @let data = icon();
    <a
      class="mr-2 min-h-[44px]"
      pButton
      [href]="data.url"
      target="_blank"
      [outlined]="true"
      rel="noopener noreferrer"
      severity="contrast"
      [pTooltip]="data.tooltip"
      tooltipPosition="top"
    >
      <img [ngSrc]="data.icon" width="24" height="24" alt="data.alt" />
    </a>
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
  imports: [Tooltip, ButtonModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterIconLink {
  public readonly icon = input.required<FooterLink>();
}

@Component({
  selector: 'msc-footer',
  template: `<p-card>
    <div class="flex flex-col justify-center items-center">
      <p class="mb-2">Powered by</p>
      <div class="flex">
        @for (link of links; track link.alt) {
          <msc-footer-icon [icon]="link"></msc-footer-icon>
        }
      </div>
    </div>
  </p-card>`,
  styles: [
    `
      :host ::ng-deep .p-card-body {
        padding-top: 5px !important;
      }
    `,
  ],
  imports: [CardModule, FooterIconLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  public links: FooterLink[] = [
    {
      icon: '/icons/primeng.png',
      url: 'https://primeng.org/',
      alt: 'prime ng logo',
      tooltip: 'PrimeNG',
    },
    {
      icon: '/icons/angular.png',
      url: 'https://angular.dev/',
      alt: 'angular logo',
      tooltip: 'Angular',
    },
    {
      icon: '/icons/nest.svg',
      url: 'https://nestjs.com/',
      alt: 'nest js logo',
      tooltip: 'NestJS',
    },
    {
      icon: '/icons/tailwind.png',
      url: 'https://tailwindcss.com/',
      alt: 'tailwind',
      tooltip: 'Tailwind CSS',
    },
    {
      icon: '/icons/nx.svg',
      url: 'https://nx.dev/',
      alt: 'nx logo',
      tooltip: 'Nx',
    },
    {
      icon: '/icons/gemini.png',
      url: 'https://gemini.google.com/app',
      alt: 'google gemini logo',
      tooltip: 'Google Gemini',
    },
  ];
}
