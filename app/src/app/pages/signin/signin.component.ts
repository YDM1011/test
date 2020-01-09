import { Component, OnInit } from '@angular/core';
import {Client} from "../../interface/client";
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public data:Client = new class implements Client {
    cName: string;
    login: string;
    password: string;
  };
  constructor(
    private auth: AuthService,
    private route: Router,
    private crud:CrudService
  ) { }

  ngOnInit() {
  }
  submit(event){
    event.preventDefault();
    this.crud.post('signin', this.data).subscribe((v:any)=>{
      this.auth.setMe(v.user);
      this.route.navigate(['']);
    })
  }

}
