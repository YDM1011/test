import { Component, OnInit } from '@angular/core';
import {Department} from "../../interface/department";
import {ActivatedRoute} from "@angular/router";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-dp-edit',
  templateUrl: './dp-edit.component.html',
  styleUrls: ['./dp-edit.component.css']
})
export class DpEditComponent implements OnInit {

  public data:Department = new class implements Department {
    dpID: number;
    dpName: string;
  };
  public id:string;
  constructor(
    private route: ActivatedRoute,
    private crud:CrudService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.crud.get('tblDepartments', `${this.id}`).subscribe((v:Department)=>{
      this.data = v;
    });
  }
  submit(){
    delete this.data.dpID;
    this.crud.post('tblDepartments', this.data,`${this.id}`).subscribe((v:Department)=>{
      this.data = v;
    });
  }

}
