/**
 * Created by Ali on 5/21/2017.
 */
import {Injectable, isDevMode} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class HttpService{
  serverAddress: string = isDevMode()?'http://localhost:3000/api':
     'https://quran-together.herokuapp.com/api';

  constructor(private http: Http){}

  postData(address, data, needAuthDetails: boolean, email = null, token = null) : Observable<Response>{
    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', email);
      headers.append('token', token);
    }
    return this.http.post(this.serverAddress + '/' + address, data, {
      headers: headers
    });
  }

  putData(address, data, needAuthDetails: boolean, email = null, token = null) : Observable<Response> {
    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', email);
      headers.append('token', token);
    }
    return this.http.put(this.serverAddress + '/' + address, data, {
      headers: headers
    });
  }

  getData(address, needAuthDetails: boolean, email = null, token = null) : Observable<Response>{
    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', email);
      headers.append('token', token);
    }
    return this.http.get(this.serverAddress + '/' + address, {
      headers: headers
    });
  }

  deleteData(address, needAuthDetails: boolean, email = null, token = null) : Observable<Response>{
    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', email);
      headers.append('token', token);
    }
    return this.http.delete(this.serverAddress + '/' + address, {
      headers: headers
    });
  }
}
