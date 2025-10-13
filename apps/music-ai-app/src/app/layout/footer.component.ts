import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'msc-footer',
  template: `<p-card>
    <div class="flex flex-col justify-center items-center">
      <p class="mb-2">Powered by</p>
      <div class="flex">
        <a
          class="mr-2"
          pButton
          href="https://primeng.org/"
          target="_blank"
          [outlined]="true"
          rel="noopener noreferrer"
          severity="contrast"
          pTooltip="PrimeNG"
          tooltipPosition="top"
        >
          <img
            [ngSrc]="'/icons/primeng.png'"
            width="24"
            height="24"
            alt="prime ng logo"
          />
        </a>
        <a
          pButton
          class="mr-2"
          href="https://angular.dev/"
          target="_blank"
          [outlined]="true"
          rel="noopener noreferrer"
          severity="contrast"
          pTooltip="Angular"
          tooltipPosition="top"
        >
          <img
            [ngSrc]="'/icons/angular.png'"
            width="24"
            height="24"
            alt="angular logo"
          />
        </a>
        <a
          pButton
          class="mr-2"
          href="https://nestjs.com/"
          target="_blank"
          [outlined]="true"
          rel="noopener noreferrer"
          severity="contrast"
          pTooltip="NestJS"
          tooltipPosition="top"
        >
          <img
            [ngSrc]="'/icons/nest.svg'"
            width="24"
            height="24"
            alt="nest js logo"
          />
        </a>
        <a
          pButton
          class="mr-2"
          href="https://nx.dev/"
          target="_blank"
          [outlined]="true"
          rel="noopener noreferrer"
          severity="contrast"
          pTooltip="Nx"
          tooltipPosition="top"
        >
          <img [ngSrc]="'/icons/nx.svg'" width="24" height="24" alt="nx logo" />
        </a>
        <a
          pButton
          class="mr-2"
          href="https://gemini.google.com/app?hl=pt-BR"
          target="_blank"
          [outlined]="true"
          rel="noopener noreferrer"
          severity="contrast"
          pTooltip="Google Gemini"
          tooltipPosition="top"
        >
          <img
            [ngSrc]="'/icons/gemini.png'"
            width="24"
            height="24"
            alt="nx logo"
          />
        </a>
      </div>
    </div>
  </p-card>`,
  imports: [CardModule, ButtonModule, Tooltip, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
