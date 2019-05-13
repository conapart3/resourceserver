import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'home-header',
  providers: [ AppService ],
  templateUrl: './home-component.component.html',
  styleUrls: [ './home-component.component.css' ]
})
export class HomeComponentComponent implements OnInit {

  constructor( private _service: AppService ) {
  }

  ngOnInit() {
    this._service.checkCredentials();
  }

  logout() {
    this._service.logout();
  }

}
