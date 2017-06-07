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
  inform:200,
};

@Injectable()
export class MsgService{
  constructor(private toastCtrl: ToastController,
              private ls: LanguageService){

  }

  showMessage(type: string, text: string, hasCloseButton: boolean = false){
    var tsCtrl = this.toastCtrl.create({
      message: text,
      showCloseButton: hasCloseButton,
      position: 'bottom',
      cssClass: 'msg_'+this.ls.direction() + ' ' + (css[type]?css[type]:'normal'),
      duration: duration[type]?duration[type]:2000,
    });

    tsCtrl.present();
  }

}
