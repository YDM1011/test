import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LogoutGuard} from "./logout.guard";
import {SigninComponent} from "./pages/signin/signin.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {LayoutComponent} from "./layout/layout.component";
import {LoginedGuard} from "./logined.guard";
import {DpListComponent} from "./pages/dp-list/dp-list.component";
import {DpDetailComponent} from "./pages/dp-detail/dp-detail.component";
import {DpCreateComponent} from "./pages/dp-create/dp-create.component";
import {DpEditComponent} from "./pages/dp-edit/dp-edit.component";
import {EmpListComponent} from "./pages/emp-list/emp-list.component";
import {EmpDetailComponent} from "./pages/emp-detail/emp-detail.component";
import {EmpCreateComponent} from "./pages/emp-create/emp-create.component";
import {EmpEditComponent} from "./pages/emp-edit/emp-edit.component";
import {SignupComponent} from "./pages/signup/signup.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {HomeComponent} from "./pages/home/home.component";


const routes: Routes = [
  {path: '', component: LayoutComponent, canActivate: [LoginedGuard], children: [
      {path: '', component: HomeComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'departments', component: DpListComponent},
      {path: 'department/:id', component: DpDetailComponent},
      {path: 'department_create', component: DpCreateComponent},
      {path: 'department_edit/:id', component: DpEditComponent},
      {path: 'employees', component: EmpListComponent},
      {path: 'employee/:id', component: EmpDetailComponent},
      {path: 'employee_create', component: EmpCreateComponent},
      {path: 'employee_edit/:id', component: EmpEditComponent},
    ]},
  {path: 'signin', component: SigninComponent, canActivate: [LogoutGuard]},
  {path: 'signup', component: SignupComponent, canActivate: [LogoutGuard]},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
