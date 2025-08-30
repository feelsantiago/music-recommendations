import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

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
            href="https://github.com/feels/music-ai"
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
