// contains logic for server interactions
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string ) {
  }
}

/*
Note that:

To get an Access Token we send a POST to the “/oauth/token” endpoint
We’re using the client credentials and Basic Auth to hit this endpoint
We’re then sending the user credentials along with the client id and grant type parameters URL encoded
After we obtain the Access Token – we store it in a cookie.

The cookie storage is especially important here, because we’re only using the cookie for storage purposes
and not to drive the authentication process directly. This helps protect against cross-site request forgery
(CSRF) type of attacks and vulnerabilities.
 */

@Injectable()
export class AppService {
  constructor(
    private _router: Router, private _http: Http ) {
  }

  // to obtain Access token given user credentials
  obtainAccessToken( loginData ) {
    let params = new URLSearchParams();
    params.append('username', loginData.username);
    params.append('password', loginData.password);
    params.append('grant_type', 'password');
    params.append('client_id', 'fooClientIdPassword');
    let headers = new Headers({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Basic ' + btoa("fooClientIdPassword:secret")
    });
    let options = new RequestOptions({ headers: headers });

    this._http.post('http://localhost:8081/spring-security-oauth-server/oauth/token',
      params.toString(), options)
      .map(res => res.json())
      .subscribe(
        data => this.saveToken(data),
        err => alert('Invalid Credentials'));
  }

  // to save our access token in a cookie using ng2-cookies library
  saveToken( token ) {
    var expireDate = new Date().getTime() + (1000 * token.expires_in);
    Cookie.set("access_token", token.access_token, expireDate);
    this._router.navigate([ '/' ]);
  }

  // to get a Foo object from server using its ID
  getResource( resourceUrl ): Observable<User> {
    var headers = new Headers({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Bearer ' + Cookie.get('access_token')
    });
    var options = new RequestOptions({ headers: headers });
    return this._http.get(resourceUrl, options)
      .map(( res: Response ) => res.json())
      .catch(( error: any ) => Observable.throw(error.json().error || 'Server error'));
  }

  // to check if user is logged in or not
  checkCredentials() {
    if ( !Cookie.check('access_token') ) {
      this._router.navigate([ '/login' ]);
    }
  }

  // to delete access token cookie and log the user out
  logout() {
    Cookie.delete('access_token');
    this._router.navigate([ '/login' ]);
  }
}
