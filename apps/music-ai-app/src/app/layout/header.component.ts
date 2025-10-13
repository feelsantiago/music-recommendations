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
          <a
            class="mr-2"
            href="https://x.com/feelssantiago"
            pButton
            target="_blank"
            severity="secondary"
            rel="noopener noreferrer"
          >
            <i class="pi pi-twitter"></i>
          </a>
          <a
            href="https://github.com/feelsantiago/music-recommendations"
            pButton
            target="_blank"
            severity="secondary"
            rel="noopener noreferrer"
          >
            <i class="pi pi-github"></i>
          </a>
        </ng-template>
      </p-toolbar>
    </p-card>
  `,
  imports: [Toolbar, ButtonModule, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
