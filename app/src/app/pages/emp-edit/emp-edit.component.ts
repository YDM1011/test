import { Component, OnInit } from '@angular/core';
import {Department} from "../../interface/department";
import {ActivatedRoute} from "@angular/router";
import {CrudService} from "../../crud.service";
import {Employee} from "../../interface/employee";

@Component({
  selector: 'app-emp-edit',
  templateUrl: './emp-edit.component.html',
  styleUrls: ['./emp-edit.component.css']
})
export class EmpEditComponent implements OnInit {

  public data:Employee = new class implements Employee {
    dpName: string;
    empActive: number;
    empID: number;
    empName: string;
    emp_dpID: number;
  };
  public dpData:Department[];
  public id:string;
  constructor(
    private route: ActivatedRoute,
    private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('tblDepartments').subscribe((v:Department[])=>{
      this.dpData =  v
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.crud.get('tblEmployees', `${this.id}`).subscribe((v:Employee)=>{
      this.data = v;
    });
  }
  submit(){
    delete this.data.empID;
    this.crud.post('tblEmployees', this.data,`${this.id}`).subscribe((v:Employee)=>{
      this.data = v;
    });
  }
  changeActive(e){
    this.data['empActive'] = e.checked ? 1 : 0;
  }
}
