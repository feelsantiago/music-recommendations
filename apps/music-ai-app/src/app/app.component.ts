import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { Auth } from './domain/auth/auth.service';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';

@Component({
  selector: 'msc-root',
  template: `
    @if (csrf$ | async) {
      <msc-header></msc-header>
      <div class="p-8">
        <router-outlet></router-outlet>
      </div>
      <msc-footer class="absolute bottom-0 w-full"></msc-footer>
    }
  `,
  styles: [
    `
      :host {
        min-height: 100vh;
      }
    `,
  ],
  imports: [RouterModule, HeaderComponent, FooterComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  public readonly csrf$: Observable<string>;

  constructor(private readonly _auth: Auth) {
    this.csrf$ = this._auth.csrf$.pipe(filter((csrf) => !!csrf));
  }
}
