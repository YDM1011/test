import { Component, OnInit } from '@angular/core';
import {Employee} from "../../interface/employee";
import {Department} from "../../interface/department";
import {ActivatedRoute, Router} from "@angular/router";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-emp-detail',
  templateUrl: './emp-detail.component.html',
  styleUrls: ['./emp-detail.component.css']
})
export class EmpDetailComponent implements OnInit {

  public id:string;
  public data:Employee = new class implements Employee {
    dpName: string;
    empActive: number;
    empID: number;
    empName: string;
    emp_dpID: number;
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crud: CrudService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.crud.get('tblEmployees', `${this.id}?join=["emp_dpID","createdBy"]`).subscribe((v:Employee)=>{
      this.data = v;
    });
  }

}
