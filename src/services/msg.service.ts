/**
 * Created by Ali on 5/21/2017.
 */
import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";

@Injectable()
export class MsgService{
  constructor(private toastCtrl: ToastController){

  }

  showMessage(type: string, text: string, hasCloseButton: boolean = false){
    var tsCtrl = this.toastCtrl.create({
      message: text,
      showCloseButton: hasCloseButton,
      position: 'bottom'
    });

    if(type === 'warn'){
      tsCtrl.setDuration(2000);
      tsCtrl.setCssClass('warning');
    }
    else if(type === 'error'){
      tsCtrl.setDuration(3000);
      tsCtrl.setCssClass('error');
    }
    else if(type === 'inform'){
      tsCtrl.setDuration(2000);
      tsCtrl.setCssClass('informing');
    }
    else{
      tsCtrl.setDuration(2000);
      tsCtrl.setCssClass('normal');
    }

    tsCtrl.present();
  }
}