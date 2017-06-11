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
  isLoggedIn : BehaviorSubject<boolean> = new BehaviorSubject(false);
  user: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private storage: Storage, private httpService: HttpService,
              private msgService: MsgService) {
    this.user.subscribe(
      (data) => {
        if(data === null || data.email === null || data.token === null)
          this.isLoggedIn.next(false);
        else
          this.isLoggedIn.next(true);
      },
      (err) => this.isLoggedIn.next(false)
    );

    //Load user
    this.loadUser();
  }

  saveUser(userEmail, userName, userToken){
    let tempUser = {
        email: userEmail,
        name: userName,
        token: userToken
    };

    this.user.next(tempUser);
    return this.storage.set('user', tempUser);
  }

  loadUser(){
    this.storage.get('user')
        .then((data) => this.user.next(data))
        .catch((err) => {
          this.user.next(null);
          console.log(err.message)
        });
  }

  saveToken(userToken){
    let tempUser = this.user.getValue();
    return this.saveUser((tempUser === null) ? null :  tempUser.email,
                         (tempUser === null) ? null : tempUser.name,
                         userToken);
  }

  saveEmail(userEmail){
    let tempUser = this.user.getValue();
    return this.saveUser(userEmail,
                         (tempUser === null) ? null : tempUser.name,
                         (tempUser === null) ? null : tempUser.token);
  }

  saveName(userName){
    let tempUser = this.user.getValue();
    return this.saveUser(tempUser.email, userName, tempUser.token);
  }

  removeUser(){
    this.storage.remove('user');
    this.user.next(null);
  }

  logout(){
    this.removeUser();
    this.isLoggedIn.next(false);
  }

  register(userEmail, userName){
    return new Promise((resolve, reject) => {
      this.httpService.putData('user', {email: userEmail, name: userName}, false).subscribe(
        (data) => {
          this.saveUser(userEmail, userName, null)
            .then(() => {
              console.log('email:' + this.user.getValue().email);
              console.log('name:' + this.user.getValue().name);
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
      this.httpService.postData('user/auth', {email: this.user.getValue().email, code: code}, false)
        .subscribe(
          (data) => {
            let token = data.json().token;
            this.isLoggedIn.next(true);
            this.saveToken(token)
              .then(() => {
                console.log('EMAIL:' + this.user.getValue().email);
                console.log('TOKEN:' + token);
                this.httpService.deleteData('user/auth', true, this.user.getValue().email, token)
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