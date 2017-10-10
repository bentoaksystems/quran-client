/**
 * Created by Ali on 5/21/2017.
 */
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Storage} from '@ionic/storage';
import {HttpService} from "./http.service";
import {KhatmService} from "./khatm.service";
import {MsgService} from "./msg.service";

@Injectable()
export class AuthService {
  isLoggedIn : BehaviorSubject<boolean> = new BehaviorSubject(false);
  user: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private storage: Storage, private httpService: HttpService,
              private khatmService: KhatmService, private msgService: MsgService) {
    this.user.subscribe(
      (data) => {
        if(data === null || data.email === null || data.token === null)
          this.isLoggedIn.next(false);
        else{
          this.sendDeviceToken();
          this.isLoggedIn.next(true);
        }
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

    this.httpService.user = tempUser;
    this.user.next(tempUser);
    return this.storage.set('user', tempUser);
  }

  loadUser(){
    this.storage.get('user')
        .then((data) => {
          this.httpService.user = data;
          this.user.next(data);
        })
        .catch((err) => {
          this.user.next(null);
          this.httpService.user = null;
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
    this.httpService.user = null;
  }

  logout(){
    this.deleteDeviceToken()
      .then(res => {
      this.removeUser();
      this.khatmService.clearStorage();
      this.isLoggedIn.next(false);
      })
      .catch(err => {
        this.msgService.showMessage('error', 'Cannot logout you. Please try again', true);
      });
  }

  register(userEmail, userName, isRegistration: boolean){
    return new Promise((resolve, reject) => {
      if(!isRegistration){
        this.httpService.postData('user/exist', {email: userEmail}, false).subscribe(
          (data) => {
            if(data.status === 500)
              reject('You are offline now. Please connect to network');
            else if(data.json().exist)
              this.register_signin(userEmail, userName)
                .then(res => resolve(res))
                .catch(err => reject(err));
            else
              reject('This email is not exist. Please register');
          },
          (err) => {
            reject(err);
          }
        )
      }
      else{
        this.httpService.postData('user/exist', {email: userEmail}, false).subscribe(
          (data) => {
            if(data.status === 500)
              reject('You are offline now. Please connect to network');
            else if(!data.json().exist)
              this.register_signin(userEmail, userName)
                .then(res => resolve(res))
                .catch(err => reject(err));
            else
              reject('This email is exist now. Please choose another email');
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }

  private register_signin(userEmail, userName){
    return new Promise((resolve, reject) => {
      this.httpService.putData('user', {email: userEmail, name: userName}, false).subscribe(
        (data) => {
          this.saveUser(userEmail, userName, null)
            .then(() => resolve())
            .catch(er => reject(er))
        },
        (err) => reject(err));
    });
  }

  verify(code){
    return new Promise((resolve, reject) => {
      this.httpService.postData('user/auth', {email: this.user.getValue().email, code: code}, false)
        .subscribe(
          (data) => {
            let dataObj = data.json();
            this.saveUser(dataObj.email, dataObj.name, dataObj.token)
              .then(() => {
                this.isLoggedIn.next(true);
                this.httpService.deleteData('user/auth', true, this.user.getValue().email, dataObj.token)
                  .subscribe(
                    (res) => resolve(),
                    (er) => reject(er)
                  )
              })
          },
          (err) => {
            reject({message: err._body});
          }
        );
    });
  }

  storeDeviceToken(token){
    return this.storage.set('device-token', token);
  }

  getDeviceToken(): any{
    return this.storage.get('device-token');
  }

  sendDeviceToken(): any{
    return new Promise((resolve, reject) => {
      this.getDeviceToken()
        .then(res => {
          this.httpService.postData('notification/token/add', {token: res}, true).subscribe(
            // (data) => resolve(data.json()),
            (data) => resolve('Done'),
            (err) => reject(err)
          );
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  deleteDeviceToken(): any{
    return new Promise((resolve, reject) => {
      this.getDeviceToken()
        .then(res => {
          this.httpService.postData('notification/token/del', {token: res}, true).subscribe(
            (data) => resolve(data.json()),
            (err) => reject(err)
          );
        })
        .catch(err => {
          reject(err);
        })
    })
  }
}
