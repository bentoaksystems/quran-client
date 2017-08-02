/**
 * Created by Ali on 5/21/2017.
 */
import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";
import {LanguageService} from "./language";
const css={
  warn:'warning',
  error:'error',
  inform:'inform',
};
const duration={
  warn:2000,
  error:3000,
  inform:2000,
};

@Injectable()
export class MsgService{
  tsCtrl: any;
  constructor(private toastCtrl: ToastController,
              private ls: LanguageService){

  }

  showMessage(type: string, text: string, hasCloseButton: boolean = false, callback = ()=>{}){
    this.dismiss();

    if(hasCloseButton) {
      this.tsCtrl = this.toastCtrl.create({
        message: text,
        showCloseButton: true,
        position: 'bottom',
        closeButtonText: 'X',
        duration: 0,
        cssClass: 'msg_' + this.ls.direction() + ' ' + (css[type] ? css[type] : 'normal')
      });
      this.tsCtrl.onDidDismiss(callback);
    }
    else
      this.tsCtrl = this.toastCtrl.create({
        message: text,
        position: 'bottom',
        cssClass: 'msg_'+this.ls.direction() + ' ' + (css[type]?css[type]:'normal'),
        duration: duration[type]
      });

    this.tsCtrl.present();
  }

  dismiss() {
    if(this.tsCtrl) {
      this.tsCtrl.dismiss();
      this.tsCtrl = null;
    }
  }
}
