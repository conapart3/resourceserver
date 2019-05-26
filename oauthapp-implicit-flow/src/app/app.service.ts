import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Foo } from '../../../oauthapp/src/app/app.service';
// Note - I followed instruction here: https://github.com/manfredsteyer/angular-oauth2-oidc
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AppService {

  constructor(
    private _router: Router,
    private _http: Http,
    //we will start with our service, but this time we will use library angular-oauth2-oidc instead of obtaining access token ourselves
    private oauthService: OAuthService ) {
    this.oauthService.loginUrl = "http://localhost:8081/spring-security-oauth-server/oauth/authorize";
    this.oauthService.redirectUri = 'http://localhost:8086/';
    this.oauthService.clientId = "sampleClientId";
    this.oauthService.scope = "read write foo bar";
    this.oauthService.setStorage(sessionStorage);
    this.oauthService.tryLogin({});
  }

  obtainAccessToken() {
    this.oauthService.initImplicitFlow();
  }

  // in the other flow we pass token from the cookie
  getResource( resourceUrl ): Observable<Foo> {
    var headers = new Headers({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Bearer ' + this.oauthService.getAccessToken()
    });
    var options = new RequestOptions({ headers: headers });
    return this._http.get(resourceUrl, options)
      .map(( res: Response ) => res.json())
      .catch(( error: any ) => Observable.throw(error.json().error || 'Server error'));
  }

  // checking if oauthService has token. In other flow we checked the cookie
  isLoggedIn() {
    if ( this.oauthService.getAccessToken() === null ) {
      return false;
    }
    return true;
  }

  logout() {
    this.oauthService.logOut();
    location.reload();
  }
}
