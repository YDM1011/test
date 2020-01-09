import { Injectable } from '@angular/core';
import Swal from "sweetalert2";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private api = environment.host;

  constructor( private http: HttpClient ) { }

  get(api, id = null) {
    id = id ? '/' + id : id;
    return this.http.get(`${this.api}${api}${id ? id : ''}`)
  }
  handkeError(err){
    console.log(err)
  }
  delete(api, id = null) {
    return new Observable(observe => {
      Swal.fire({
        title: 'Do you confirm the deletion?',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: true,
        reverseButtons: true,
        cancelButtonText: 'Cancel!',
        confirmButtonText: 'Delete',
        confirmButtonColor: '#dd4535',
      }).then((result) => {
        if (result.value) {
          id = id ? '/' + id : id;
          observe.next(
            this.http.delete(`${this.api}${api}${id ? id : ''}`)
              .subscribe(v=>{
              observe.next(v);
            }, error => this.handkeError(error))
          );
        }
      });
    })

  }

  post(api, obj, id = null, isAlert = true) {
    return new Observable(observe => {
      this.http.post(`${this.api}${api}${id ? '/' + id : ''}`, obj).subscribe(data => {
        if (isAlert) {
          Swal.fire('Success', '', 'success');
        }
        observe.next(data)
      }, error => this.handkeError(error));
    });
  }
}
