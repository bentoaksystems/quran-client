/**
 * Created by ali71 on 17/09/2017.
 */
import {Injectable} from "@angular/core";
import {Push, PushObject, PushOptions} from '@ionic-native/push';
import {AlertController} from "ionic-angular";

import {LanguageService} from "./language";
import {MsgService} from "./msg.service";
import {CreateKhatmPage} from "../pages/create-khatm/create-khatm";
import {AuthService} from "./auth.service";

@Injectable()
export class NotificationService{
  constructor(private push: Push, private alertCtrl: AlertController,
              private ls: LanguageService, private authService: AuthService,
              private msgService: MsgService){}

  initPushNotification(platform, nav){
    if(!platform.is('cordova')){
      console.warn('Push notification not initialized. Cordova is not available - Run in physical device');
      // this.msgService.showMessage('inform', 'Push notification not initialized. Cordova is not available - Run in physical device', true);
      return;
    }

    const options: PushOptions = {
      android: {
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
      this.authService.storeDeviceToken(data.registrationId)
        .then(res => console.log('Store device token on local storage. ' + res))
        .catch(err => console.log('Cannot store device token on local storage. ' + err));
    });

    pushObject.on('notification').subscribe((data: any) => {
      //if user using app and push notification comes
      if(data.additionalData.foreground){
        //if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: this.ls.translate(data.title),
          message: this.ls.translate(data.message),
          buttons: [
            {
              text: this.ls.translate('OK'),
              role: 'cancel'
            },
            {
              text: this.ls.translate('See Khatm'),
              handler: () => {
                nav.push(CreateKhatmPage, {link: data.additionalData.share_link});
              }
            }
          ]
        });

        confirmAlert.present();
      }
      else{
        //if user Not using app and push notification comes
        nav.push(CreateKhatmPage, {link: data.additionalData.share_link});
        console.log('Push notification clicked');
      }
    });

    pushObject.on('error').subscribe(err => console.error('Error with push plugin: ' + err));
  }
}
