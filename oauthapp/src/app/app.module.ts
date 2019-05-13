import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { FormsModule } from '@angular/forms';
import { HomeComponentComponent } from './home-component/home-component.component';
import { UserComponentComponent } from './user-component/user-component.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    HomeComponentComponent,
    UserComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
