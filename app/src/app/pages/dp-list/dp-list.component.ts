import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {Department} from "../../interface/department";
import {PageEvent} from "@angular/material";

@Component({
  selector: 'app-dp-list',
  templateUrl: './dp-list.component.html',
  styleUrls: ['./dp-list.component.css']
})
export class DpListComponent implements OnInit {

  public pageEvent:PageEvent;
  public data:Department[];
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
    this.crud.get('tblDepartments','count'+this.searchLine).subscribe((v:number)=>{
        this.count = v['COUNT(*)'];
        this.crud.get('tblDepartments',`${this.searchLine}${simbol}skip=0&limit=${this.pageSize}`).subscribe((v:Department[])=>{
          this.data = v
        }, err => this.crud.handkeError(err));
    }, err => this.crud.handkeError(err))
  }
  checkPage($event){
    this.pageEvent = $event;
    let simbol = '?';
    if (this.searchLine) simbol = '&';
    this.crud.get('tblDepartments',`${this.searchLine}${simbol}skip=${this.pageEvent.pageIndex*this.pageSize}&limit=${this.pageSize}`).subscribe((v:Department[])=>{
      this.data = v
    });
  }
  delete(id){
    this.crud.delete('tblDepartments', id).subscribe((v:any)=>{
      this.data.splice(this.data.findIndex(el => el.dpID == id),1)
    })
  }
  search(){
    this.searchLine = `?like={"dpName":"${this.searchWord}"}`;
    this.init();
  }
  clearSearch(){
    this.searchWord = '';
    this.searchLine = '';
    this.init();
  }
}
