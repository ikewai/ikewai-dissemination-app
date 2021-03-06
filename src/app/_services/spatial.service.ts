import { Injectable } from '@angular/core';
import { Metadata } from '../_models/metadata';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';
//import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
import { AppConfig } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SpatialService {

  constructor(private http: HttpClient)  {
  }


  spatialSearch(geometry: any): Observable<Metadata[]>{

    interface ResponseResults {
     result: any
    }
     let query = "{'$and':[{'value.loc': {$geoWithin: {'$geometry':"+JSON.stringify(geometry).replace(/"/g,'\'')+"}}}]}";
     console.log(query)
     let url = AppConfig.settings.aad.tenant+"/meta/v2/data?q="+encodeURI(query)+"&limit=1000&offset=0";
        //.set("Authorization", "Bearer " + currentUser.access_token)
     let head = new HttpHeaders()
     .set("Content-Type", "application/x-www-form-urlencoded");
     let options = {
       headers: head
     };
     console.log("stuff")


    let response = this.http.get<any>(url, options)
     .pipe(
      retry(3),
      map((data) => {
        console.log("more")
        return data.result as Metadata[];
      }),
      catchError((e) => {
        return Observable.throw(new Error(e.message));
      }),
    );
    return response;
   }
}
