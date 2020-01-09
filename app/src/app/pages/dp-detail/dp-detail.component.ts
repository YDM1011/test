import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CrudService} from "../../crud.service";
import {Department} from "../../interface/department";
import {Employee} from "../../interface/employee";

@Component({
  selector: 'app-dp-detail',
  templateUrl: './dp-detail.component.html',
  styleUrls: ['./dp-detail.component.css']
})
export class DpDetailComponent implements OnInit {

  public id:string;
  public empData:Employee[];
  public data:Department = new class implements Department {
    dpID: number;
    dpName: string;
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crud:CrudService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.crud.get('tblDepartments', `${this.id}`).subscribe((v:Department)=>{
      this.data = v;
    });
    this.crud.get('tblEmployees', `?like={"emp_dpID":"${this.id}"}`).subscribe((v:Employee[])=>{
      this.empData = v;
    })
  }

}
