import {Component, OnInit, isDevMode} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController} from 'ionic-angular';

import {MsgService} from "../../services/msg.service";
import {AuthService} from "../../services/auth.service";
import {QuranService} from "../../services/quran.service";
import {Verification} from "../verification/verification";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'registration.html',
})
export class Registration implements OnInit{
  email: string = '';
  reEmail: string = '';
  name: string = '';
  conditionalColoring: any = {
    background: 'normal_back',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private viewCtrl: ViewController, private msgService: MsgService,
              private authService: AuthService, private quranService: QuranService,
              private modalCtrl: ModalController) {
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

  register(){
    if(this.mailValidation(this.email)){
      if(this.email.toLowerCase() === this.reEmail.toLowerCase()){
        //Register user
        this.authService.register(this.email, this.name)
          .then(() => {
            this.modalCtrl.create(Verification).present();
          })
          .catch((err) => this.msgService.showMessage('error', err))
      }
      else
        this.msgService.showMessage('error', 'The repeated email not match');
    }
    else
      this.msgService.showMessage('error', 'The email is not valid');
  }

  skip(){
    this.viewCtrl.dismiss();
  }

  mailValidation(mail){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
  }
}
