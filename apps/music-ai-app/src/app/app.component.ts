import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Toast } from 'primeng/toast';
import { filter, Observable } from 'rxjs';
import { Auth } from './domain/auth/auth.service';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';

@Component({
  selector: 'msc-root',
  template: `
    <p-toast />
    @if (csrf$ | async) {
      <div class="flex flex-col min-h-screen justify-between">
        <div>
          <msc-header />
          <div class="p-5">
            <router-outlet />
          </div>
        </div>
        <msc-footer />
      </div>
    }
  `,
  styles: [
    `
      :host {
        min-height: 100vh;
      }
    `,
  ],
  imports: [RouterModule, HeaderComponent, FooterComponent, AsyncPipe, Toast],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  public readonly csrf$: Observable<string>;

  constructor(private readonly _auth: Auth) {
    this.csrf$ = this._auth.csrf$.pipe(filter((csrf) => !!csrf));
  }
}
