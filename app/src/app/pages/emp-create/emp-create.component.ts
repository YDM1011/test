import { Component, OnInit } from '@angular/core';
import {Employee} from "../../interface/employee";
import {ActivatedRoute} from "@angular/router";
import {CrudService} from "../../crud.service";
import {Department} from "../../interface/department";

@Component({
  selector: 'app-emp-create',
  templateUrl: './emp-create.component.html',
  styleUrls: ['./emp-create.component.css']
})
export class EmpCreateComponent implements OnInit {
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
  }
  submit(){
    if (this.data['empActive'] !== 0 && !this.data['empActive']) {
      this.data['empActive'] = 0
    }
    this.crud.post('tblEmployees', this.data).subscribe((v:Employee)=>{
      this.data =  new class implements Employee {
        dpName: string;
        empActive: number;
        empID: number;
        empName: string;
        emp_dpID: number;
      };
    });
  }
  changeActive(e){
    this.data['empActive'] = e.checked ? 1 : 0;
  }
  selectionChange(e){
    this.data['emp_dpID'] = e.value
  }
}
