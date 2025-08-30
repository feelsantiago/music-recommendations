import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'msc-home',
  template: `<h1>Home</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
