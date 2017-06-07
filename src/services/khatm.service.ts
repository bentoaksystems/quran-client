/**
 * Created by Ali on 6/3/2017.
 */
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

import {HttpService} from "./http.service";
import {AuthService} from "./auth.service";

@Injectable()
export class KhatmService{
  khatms: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(private httpService: HttpService, private authService: AuthService){
  }

  createKhatm(data){
    return new Promise((resolve, reject) => {
      this.httpService.putData('khatm', data, true, this.authService.user.getValue().email, this.authService.user.getValue().token)
          .subscribe(
              (data) => {
                this.loadKhatm(this.authService.user.getValue().email);
                resolve();
              },
              (err) => {
                console.log(err);
                reject(err);
              }
          )
    });
  }

  loadKhatm(userEmail) {
      console.log('UserEmail:' + userEmail);
      this.authService.user.subscribe(
          (data) => {
              if(data !== null)
                  this.httpService.getData('khatm', true, userEmail, data.token)
                      .subscribe(
                          (res) => {
                              let data = res.json();
                              console.log('data:', data);
                              let tempList = [];
                              for (let item of data) {
                                  tempList.push(item);
                              }
                              this.khatms.next(tempList);
                          },
                          (err) => {
                              console.log(err.message);
                              this.khatms.next([]);
                          }
                      )
          },
          (err) => console.log(err.message)
      );
  }
}