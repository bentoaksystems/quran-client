/**
 * Created by Ali on 5/21/2017.
 */
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class HttpService{
  serverAddress: string = 'http://192.168.1.14:3000/api';

  constructor(private http: Http){}

  postData(address, data) : Observable<Response>{
    return this.http.post(this.serverAddress + '/' + address, data);
  }

  putData(address, data) : Observable<Response> {
    return this.http.put(this.serverAddress + '/' + address, data);
  }

  getData(){

  }

  deleteData(address, data) : Observable<Response>{
    return this.http.delete(this.serverAddress + '/' + address);
  }
}