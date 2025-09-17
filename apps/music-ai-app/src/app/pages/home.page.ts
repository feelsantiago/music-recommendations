import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { RecommendationComponent } from '../components/recommendation/recommendation.component';

@Component({
  selector: 'msc-home',
  template: `
    <div class="max-w-120 mx-auto">
      <msc-recommendation></msc-recommendation>
    </div>
  `,
  imports: [RecommendationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  constructor(private readonly _http: HttpClient) {}

  public ngOnInit(): void {
    this._http
      .get<any>('/api/auth/session')
      .pipe(
        tap((response) => {
          console.log(response);
        }),
        switchMap((response) => {
          return this._http.post(
            '/api/auth/test',
            {},
            {
              withCredentials: true,
              headers: {
                'x-csrf-token': response.csrf,
              },
            },
          );
        }),
      )
      .subscribe({
        next: console.log,
        error: console.error,
      });
  }
}
