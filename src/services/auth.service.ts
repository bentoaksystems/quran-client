/**
 * Created by Ali on 5/21/2017.
 */
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Storage} from '@ionic/storage';
import {HttpService} from "./http.service";
import {MsgService} from "./msg.service";

@Injectable()
export class AuthService {
  email: BehaviorSubject<string> = new BehaviorSubject(null);
  name: BehaviorSubject<string> = new BehaviorSubject(null);
  token: BehaviorSubject<string> = new BehaviorSubject(null);
  isLoggedIn : BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private storage: Storage, private httpService: HttpService,
              private msgService: MsgService) {
    this.email.subscribe(
      (data) => {
        if(data === null)
          this.isLoggedIn.next(false);
        else
          this.isLoggedIn.next(true);
      }
    );

    this.token.subscribe(
      (data) => {
        if(data === null)
          this.isLoggedIn.next(false);
        else
          this.isLoggedIn.next(true);
      }
    );

    //Load user data
    this.loadUserData();
  }

  saveUserData(userEmail, userName, userToken){
    this.saveEmail(userEmail);
    this.saveName(userName);
    this.saveToken(userToken);
  }

  loadUserData(){
    this.storage.get('email')
        .then((data) => this.email.next(data))
        .catch((err) => {
          this.email.next(null);
          console.log(err.message);
        });
    this.storage.get('name')
        .then((data) => this.name.next(data))
        .catch((err) => {
          this.name.next(null);
          console.log(err.message)
        });
    this.loadToken();
  }

  saveToken(userToken){
    this.token.next(userToken);
    return this.storage.set('token', userToken);
  }

  saveEmail(userEmail){
    this.email.next(userEmail);
    return this.storage.set('email', userEmail);
  }

  saveName(userName){
    this.name.next(userName);
    return this.storage.set('name', userName);
  }

  loadToken(){
    this.storage.get('token')
      .then((val) => {
        this.token.next(val);
      })
      .catch((err) => {
        this.token.next(null);
        console.log(err.message);
      })
  }

  removeUser(){
    this.storage.remove('email');
    this.email.next(null);
    this.storage.remove('name');
    this.name.next(null);
    this.storage.remove('token');
    this.token.next(null);
  }

  logout(){
    this.removeUser();
    this.isLoggedIn.next(false);
  }

  register(userEmail, userName){
    return new Promise((resolve, reject) => {
      this.httpService.putData('user', {email: userEmail, name: userName}).subscribe(
        (data) => {
          this.saveEmail(userEmail)
            .then(() => {
              return this.saveName(userName);
            })
            .then(() => {
              console.log('email:' + this.email);
              console.log('name:' + this.name);
              resolve();
            })
        },
        (err) => {
          reject(err);
        }
      )
    });
  }

  verify(code){
    return new Promise((resolve, reject) => {
      // this.msgService.showMessage('inform', this.email.getValue());
      // console.log(this.email.getValue());
      this.httpService.postData('user/auth', {email: this.email.getValue(), code: code})
        .subscribe(
          (data) => {
            let token = data.json().token;
            console.log(token.token);
            this.isLoggedIn.next(true);
            this.saveToken(token)
              .then(() => {
                console.log('EMAIL:' + this.email.getValue());
                console.log('TOKEN:' + token);
                this.httpService.postData('user/auth/delete', {email: this.email.getValue(), token: token})
                  .subscribe(
                    (res) => resolve(),
                    (er) => reject(er)
                  )
              })
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
}