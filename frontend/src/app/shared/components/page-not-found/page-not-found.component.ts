// not-authorized.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-authorized',
  template: `<h2>403 - Not Authorized</h2>
    <p>You do not have permission to view this page.</p>`,
})
export class NotAuthorizedComponent {}
