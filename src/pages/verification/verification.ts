import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {QuranService} from "../../services/quran.service";
import {MsgService} from "../../services/msg.service";

/**
 * Generated class for the Verification page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html',
})
export class Verification implements OnInit{
  conditionalColoring: any = {
    background: 'normal_back',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };
  code = '123456';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private authService: AuthService, private quranService: QuranService,
              private viewCtrl: ViewController, private msgService: MsgService) {
  }

  ngOnInit(){
    this.conditionalColoring.background = (this.quranService.nightMode) ? 'night_back' : 'normal_back';
    this.conditionalColoring.text = (this.quranService.nightMode) ? 'night_text' : 'normal_text';
    this.conditionalColoring.primary = (this.quranService.nightMode) ? 'night_primary' : 'normal_primary';
    this.conditionalColoring.secondary = (this.quranService.nightMode) ? 'night_secondary' : 'normal_secondary';

    this.quranService.nightMode$.subscribe(
        (data) => {
          if(data) {
            this.conditionalColoring.background = 'night_back';
            this.conditionalColoring.text = 'night_text';
            this.conditionalColoring.primary = 'night_primary';
            this.conditionalColoring.secondary = 'night_secondary';
          }
          else{
            this.conditionalColoring.background = 'normal_back';
            this.conditionalColoring.text = 'normal_text';
            this.conditionalColoring.primary = 'normal_primary';
            this.conditionalColoring.secondary = 'normal_secondary';
          }
        }
    )
  }

  reSend(){

  }

  changeMail(){
    this.viewCtrl.dismiss();
  }

  verify(code){
    if(!this.checkCode(code)){
      this.msgService.showMessage('warn', 'The verification code should contain 6 digits');
    }
    else{
      this.authService.verify(code)
        .then(() => {
          this.navCtrl.popToRoot();
          this.viewCtrl.dismiss();
        })
        .catch((err) => {
          this.msgService.showMessage('error', err.message);
        })
    }
  }

  checkCode(code){
    if(code.length > 6 || code.length < 6)
      return false;

    for(let i=0; i<code.length; i++){
      console.log(code.charCodeAt(i));
      if(code.charCodeAt(i) < 48 || code.charCodeAt(i) > 57)
        return false;
    }

    return true;
  }
}
