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
    this.storage.set('token', userToken);
  }

  saveEmail(userEmail){
    this.storage.set('email', userEmail);
  }

  saveName(userName){
    this.storage.set('name', userName);
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

  //Get token
  login(userEmail){
    // this.httpService.postData('user/exist', {email: userEmail}).subscribe(
    //   (data) => {
    //     if(data){
    //       this.httpService.postData('user/confirmation', {email: userEmail}).subscribe(
    //         (val) => {
    //           this.msgService.showMessage('inform', 'The confirmation mail sent to ' +  userEmail, true);
    //         },
    //         (error) => {
    //           this.msgService.showMessage('error', error.message);
    //         }
    //       )
    //     }
    //     else{
    //       this.msgService.showMessage('inform', 'This email does not exist');
    //     }
    //   },
    //   (err) => {
    //     console.log(err.message);
    //     this.msgService.showMessage('error', err.message);
    //   }
    // )
  }

  register(userEmail, userName){
    return new Promise((resolve, reject) => {
      this.httpService.putData('user', {email: userEmail, name: userName}).subscribe(
        (data) => {
          this.saveEmail(userEmail);
          this.saveName(userName);
          resolve();
        },
        (err) => {
          reject(err);
        }
      )
    });
  }

  verify(code){
    return new Promise((resolve, reject) => {
      this.httpService.postData('user/auth', {email: this.email.getValue(), code: code})
        .subscribe(
          (data) => {
            let token = data.json();
            this.saveToken(token);
            this.httpService.deleteData('user/auth', {email: this.email.getValue(), token: token})
              .subscribe(
                (res) => resolve(),
                (er) => reject(er)
              )
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
}