/**
 * Created by ali71 on 17/09/2017.
 */
import {Injectable} from "@angular/core";
import {Push, PushObject, PushOptions} from '@ionic-native/push';
import {AlertController} from "ionic-angular";

import {LanguageService} from "./language";
import {HttpService} from "./http.service";
import {MsgService} from "./msg.service";

@Injectable()
export class NotificationService{
  constructor(private push: Push, private alertCtrl: AlertController,
              private ls: LanguageService, private httpService: HttpService,
              private msgService: MsgService){}

  initPushNotification(platform, nav){
    if(!platform.is('cordova')){
      console.warn('Push notification not initialized. Cordova is not available - Run in physical device');
      // this.msgService.showMessage('inform', 'Push notification not initialized. Cordova is not available - Run in physical device', true);
      return;
    }

    const options: PushOptions = {
      android: {
        senderID: '284209242898',
        sound: true,
        vibrate: true
      },
      ios: {
        alert: 'true',
        badge: 'false',
        sound: 'true'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('Device token: ' + data.registrationId);
      this.httpService.postData('notification/token', {token: data.registrationId}, true).subscribe(
        (data) => this.msgService.showMessage('inform', data.json(), true),
        (err) => this.msgService.showMessage('error', err, true)
      );
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message: ' + data.message);
      //if user using app and push notification comes
      if(data.additionalData.foreground){
        //if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: this.ls.translate('Remind Notification'),
          message: this.ls.translate(data.message),
          buttons: [{
            text: 'OK',
            role: 'cancel'
          }]
        });

        confirmAlert.present();
      }
      else{
        //if user Not using app and push notification comes
        //TODO: our login on click of push notification directly
        //TODO: redirect user to khatm page
        nav.push('DetailsPage', {message: data.message});
        console.log('Push notification clicked');
      }
    });

    pushObject.on('error').subscribe(err => console.error('Error with push plugin: ' + err));
  }

  register(){

  }
}
