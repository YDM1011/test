import { Component, OnInit } from '@angular/core';
import {CrudService} from "../crud.service";
import {AuthService} from "../auth.service";
import {CookieService} from "ngx-cookie-service";
import {Client} from "../interface/client";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  public user:Client = new class implements Client {
    cName: string;
    login: string;
    password: string;
  };
  public loaded:boolean = false;
  constructor(
    private crud:CrudService,
    private auth:AuthService,
    private cookie:CookieService
  ) { }

  ngOnInit() {
    this.crud.get('client/'+this.cookie.get('userId')).subscribe((v:Client)=>{
      this.auth.setMe(v);
      this.loaded = true;
    })
  }

}
