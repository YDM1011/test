import { Component, OnInit } from '@angular/core';
import {PageEvent} from "@angular/material";
import {CrudService} from "../../crud.service";
import {Employee} from "../../interface/employee";

@Component({
  selector: 'app-emp-list',
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.css']
})
export class EmpListComponent implements OnInit {
  public pageEvent:PageEvent;
  public data:Employee[];
  public searchLine:string = '';
  public searchWord:string = '';
  public count:number;
  public pageSize:number;
  public isPagination:boolean = false;
  constructor(
    private crud:CrudService
  ) { }

  ngOnInit() {
    this.pageSize = 5;
    this.init()
  }
  init(){
    let simbol = '?';
    if (this.searchLine) simbol = '&';
    this.crud.get('tblEmployees','count'+this.searchLine).subscribe((v:number)=>{
      if (v) {
        this.count = v['COUNT(*)'];
        this.isPagination = true;
        this.crud.get('tblEmployees',`${this.searchLine}${simbol}join=emp_dpID&skip=0&limit=${this.pageSize}`).subscribe((dpV:Employee[])=>{
          if (dpV) {
            this.data = dpV;
          }
        })
      }
    })
  }
  checkPage($event){
    this.pageEvent = $event;
    let simbol = '?';
    if (this.searchLine) simbol = '&';
    this.crud.get('tblEmployees',`${this.searchLine}${simbol}join=emp_dpID&skip=${this.pageEvent.pageIndex*this.pageSize}&limit=${this.pageSize}`).subscribe((dpV:Employee[])=>{
      if (dpV) {
        this.data = dpV;
      }
    })
  }
  delete(id){
    this.crud.delete('tblEmployees', id)
      .subscribe((v:any)=>{
      this.init();
    })
  }
  search(){
    this.searchLine = `?like={"empName":"${this.searchWord}"}`;
    this.init();
  }
  clearSearch(){
    this.searchWord = '';
    this.searchLine = '';
    this.init();
  }
}
