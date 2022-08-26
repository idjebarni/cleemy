import { Component } from '@angular/core';

@Component({
  selector: 'cleemy-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  title = 'Oops, where are we?';
  description = 'Unable to find the requested page.';
  redirect = '/app';
  redirectText = 'Back to user list';

  constructor() {}
}
