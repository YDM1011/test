import { Component, OnInit } from '@angular/core';
import {Client} from "../../interface/client";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public user:Client = new class implements Client {
    cName: string;
    login: string;
    password: string;
  };
  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v:Client)=>{
      if (v) {
        this.user = v
      }
    })
  }

}
