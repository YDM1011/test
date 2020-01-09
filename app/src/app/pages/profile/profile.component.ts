import { Component, OnInit } from '@angular/core';
import {Client} from "../../interface/client";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
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
