import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import { DpListComponent } from './pages/dp-list/dp-list.component';
import { DpDetailComponent } from './pages/dp-detail/dp-detail.component';
import { DpEditComponent } from './pages/dp-edit/dp-edit.component';
import { DpCreateComponent } from './pages/dp-create/dp-create.component';
import { EmpCreateComponent } from './pages/emp-create/emp-create.component';
import { EmpListComponent } from './pages/emp-list/emp-list.component';
import { EmpDetailComponent } from './pages/emp-detail/emp-detail.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import {MaterialModule} from "./material-module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ApiInterceptor} from "./api.interceptor";
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { EmpEditComponent } from './pages/emp-edit/emp-edit.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import {CookieService} from "ngx-cookie-service";
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    DpListComponent,
    DpDetailComponent,
    DpEditComponent,
    DpCreateComponent,
    EmpCreateComponent,
    EmpListComponent,
    EmpDetailComponent,
    SigninComponent,
    SignupComponent,
    LayoutComponent,
    NotFoundComponent,
    EmpEditComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ProfileComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    MaterialModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  exports: [MaterialModule],
  providers: [CookieService,{provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
