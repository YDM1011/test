import { Component, OnInit } from '@angular/core';
import {Department} from "../../interface/department";
import {ActivatedRoute} from "@angular/router";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-dp-create',
  templateUrl: './dp-create.component.html',
  styleUrls: ['./dp-create.component.css']
})
export class DpCreateComponent implements OnInit {
  public data:Department = new class implements Department {
    dpID: number;
    dpName: string;
  };
  public id:string;
  constructor(
    private route: ActivatedRoute,
    private crud:CrudService
  ) { }

  ngOnInit() {  }
  submit(){
    delete this.data.dpID;
    this.crud.post('tblDepartments', this.data).subscribe((v:Department)=>{
      this.data = new class implements Department {
        dpID: number;
        dpName: string;
      };
    });
  }
}
