import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, LoadingController} from 'ionic-angular';

import {MsgService} from "../../services/msg.service";
import {AuthService} from "../../services/auth.service";
import {QuranService} from "../../services/quran.service";
import {Verification} from "../verification/verification";
import {StylingService} from "../../services/styling";
import {LanguageService} from "../../services/language";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'registration.html',
})
export class Registration implements OnInit{
  email: string = '';
  reEmail: string = '';
  name: string = '';
  showVerify: boolean = false;
  conditionalColoring: any = {
    background: 'normal_back',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };
  loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private viewCtrl: ViewController, private msgService: MsgService,
              private authService: AuthService, private quranService: QuranService,
              private ls: LanguageService, private loadingCtrl: LoadingController,
              private stylingService: StylingService) {}


  ngOnInit(){
    this.conditionalColoring.background = (this.stylingService.nightMode) ? 'night_back' : 'normal_back';
    this.conditionalColoring.text = (this.stylingService.nightMode) ? 'night_text' : 'normal_text';
    this.conditionalColoring.primary = (this.stylingService.nightMode) ? 'night_primary' : 'normal_primary';
    this.conditionalColoring.secondary = (this.stylingService.nightMode) ? 'night_secondary' : 'normal_secondary';

    this.stylingService.nightMode$.subscribe(
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
    );

    this.authService.user.subscribe(
      (data) => {
        if(data !== null && data.email !== null && data.email !== undefined)
          this.showVerify = true;
        else
          this.showVerify = false;
      },
      (err) => {
        this.showVerify = false;
      }
    );


    this.authService.loadUser();
  }

  register(){
    if(this.mailValidation(this.email)){
      if(this.email.toLowerCase() === this.reEmail.toLowerCase()){
        this.setLoading();

        //Register user
        this.authService.register(this.email, this.name)
          .then(() => {
            this.showVerify = true;
            this.loading.dismiss();
          })
          .catch((err) => {
            this.loading.dismiss();
            this.msgService.showMessage('error', err);
          })
      }
      else
        this.msgService.showMessage('error', this.ls.translate('Emails do not match'));
    }
    else
      this.msgService.showMessage('error', this.ls.translate('The email address is not valid'));
  }

  skip(){
    this.viewCtrl.dismiss();
  }

  mailValidation(mail){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
  }

  reSend(){
    this.setLoading();
    this.authService.register(this.authService.user.getValue().email, this.authService.user.getValue().name)
      .then((res) => {
        this.loading.dismiss();
        this.msgService.showMessage('inform', this.ls.translate('The verification code has been sent to ') + this.authService.user.getValue().email);
      })
      .catch((err) => {
        this.loading.dismiss();
        this.msgService.showMessage('error', err);
      });
  }

  changeMail(){
    this.authService.removeUser();
    this.showVerify = false;
  }

  verify(code){
    if(!this.checkCode(code)){
      this.msgService.showMessage('warn', this.ls.translate('The verification code consists of 6 digits'));
    }
    else{
      this.authService.verify(code)
        .then(() => {
          this.navCtrl.popToRoot();
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

  setLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait until send verification code ...'
    });
    
    this.loading.present();
  }
}
