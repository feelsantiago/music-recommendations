import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'msc-footer',
  template: `<p-card>
    <p class="m-0 text-center">
      Made by
      <a
        class="text-blue-300 visited:text-purple-60"
        href="https://x.com/feelssantiago"
        target="_blank"
        rel="noopener noreferrer"
        >@feelssantiago</a
      >
    </p>
  </p-card>`,
  imports: [CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
