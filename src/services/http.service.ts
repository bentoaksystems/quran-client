/**
 * Created by Ali on 5/21/2017.
 */
import {Injectable, isDevMode} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {Network} from "@ionic-native/network";
import {Storage} from "@ionic/storage";

@Injectable()
export class HttpService{
  // serverAddress: string = isDevMode()?'http://192.168.1.10:3000/api':
  //    'https://quran-together.herokuapp.com/api';

  serverAddress: string = 'http://localhost:3000/api';
  isDisconnected: boolean = false;

  constructor(private http: Http, private network: Network,
              private storage: Storage){
    this.network.onDisconnect().subscribe(
        () => this.isDisconnected = true
    );

    this.network.onConnect().subscribe(
        () => {
          this.sendBufferedRequests();
          this.isDisconnected = false;
          this.storage.remove('http_buffer');
        }
    );
  }

  postData(address, data, needAuthDetails: boolean, canBuffer = true, email = null, token = null) : Observable<Response>{
    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', email);
      headers.append('token', token);
    }

    let request = this.http.post(this.serverAddress + '/' + address, data, {
      headers: headers
    });

    if(canBuffer && this.isDisconnected)
      this.bufferingRequest({type: 'post', address: address, data: data, headers: headers});
    else
      return request;
  }

  putData(address, data, needAuthDetails: boolean, canBuffer = true, email = null, token = null) : Observable<Response> {
    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', email);
      headers.append('token', token);
    }

    let request = this.http.put(this.serverAddress + '/' + address, data, {
      headers: headers
    });

    if(canBuffer && this.isDisconnected)
      this.bufferingRequest({type: 'put', address: address, data: data, headers: headers});
    else
      return request;
  }

  getData(address, needAuthDetails: boolean, canBuffer = true, email = null, token = null) : Observable<Response>{
    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', email);
      headers.append('token', token);
    }

    let request = this.http.get(this.serverAddress + '/' + address, {
      headers: headers
    });

    if(canBuffer && this.isDisconnected)
      this.bufferingRequest({type: 'get', address: address, data: null, headers: headers});
    else
      return request;
  }

  deleteData(address, needAuthDetails: boolean, canBuffer = true, email = null, token = null) : Observable<Response>{
    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', email);
      headers.append('token', token);
    }

    let request = this.http.delete(this.serverAddress + '/' + address, {
      headers: headers
    });

    if(canBuffer && this.isDisconnected)
      this.bufferingRequest({type: 'delete', address: address, data: null, headers: headers});
    else
      return request;
  }

  sendBufferedRequests(){
    this.storage.get('http_buffer')
      .then((buffer) => {
        for(let req of buffer){
          switch (req.type){
            case 'post': this.http.post(this.serverAddress + '/' + req.address, req.data, {headers: req.headers});
              break;
            case 'put': this.http.put(this.serverAddress + '/' + req.address, req.data, {headers: req.headers});
              break;
            case 'get': this.http.get(this.serverAddress + '/' + req.address, {headers: req.headers});
              break;
            case 'delete': this.http.delete(this.serverAddress + '/' + req.address, {headers: req.headers});
              break;
          }
        }
      });
  }

  bufferingRequest(request){
    this.storage.get('http_buffer')
      .then(value => {
        let temp_buffer = (value === null) ? [] : value;
        temp_buffer.push(request);
        this.storage.set('http_buffer', temp_buffer);
      });
  }
}
