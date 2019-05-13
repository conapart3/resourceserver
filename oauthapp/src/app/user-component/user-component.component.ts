import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'user-details',
  providers: [ AppService ],
  templateUrl: './user-component.component.html',
  styleUrls: [ './user-component.component.css' ]
})
export class UserComponentComponent {

  constructor( private _service: AppService ) {
  }

  getUser() {
    this._service.getResource(this.usersUrl + this.user.id)
      .subscribe(
        data => this.user = data,
        error => this.user.name = 'Error');
  }
}
