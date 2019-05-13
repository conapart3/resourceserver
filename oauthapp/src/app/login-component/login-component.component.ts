import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'login-form',
  providers: [AppService],
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent {

  public loginData = {username: "", password: ""};

  constructor(private _service:AppService) { }

  login() {
    this._service.obtainAccessToken(this.loginData)
  }

}
