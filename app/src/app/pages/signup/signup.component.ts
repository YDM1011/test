import { Component, OnInit } from '@angular/core';
import {Client} from "../../interface/client";
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

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
    this.crud.post('signup', this.data).subscribe((v:any)=>{
      this.auth.setMe(v.user);
      this.route.navigate(['']);
    })
  }
}
