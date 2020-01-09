import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {Client} from "../../interface/client";
import {Router} from "@angular/router";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public user:Client = new class implements Client {
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
    this.auth.onMe.subscribe((v:Client)=>{
      if (v) {
        this.user = v
      }
    })
  }

  logout(){
    this.crud.post('logout', {}, false).subscribe((v:any)=>{
      this.auth.clearMe();
      this.route.navigate(['signin']);
    })
  }
}
