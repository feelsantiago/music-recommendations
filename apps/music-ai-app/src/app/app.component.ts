import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';

@Component({
  imports: [RouterModule, HeaderComponent, FooterComponent],
  selector: 'msc-root',
  template: `
    <msc-header></msc-header>
    <div class="p-8">
      <router-outlet></router-outlet>
    </div>
    <msc-footer class="absolute bottom-0 w-full"></msc-footer>
  `,
  styles: [
    `
      :host {
        min-height: 100vh;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
