import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import {MsgService} from "../../services/msg.service";
import {AuthService} from "../../services/auth.service";
import {QuranService} from "../../services/quran.service";
import {Verification} from "../verification/verification";
import {StylingService} from "../../services/styling";

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private viewCtrl: ViewController, private msgService: MsgService,
              private authService: AuthService, private stylingService: StylingService) {
  }

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


    this.authService.email.subscribe(
      (email) => {
        if(email !== null && email !== undefined)
          this.showVerify = true;
        else
          this.showVerify = false;
      },
      (err) => {
        this.showVerify = false;
      }
    );
    this.authService.loadUserData();

  }

  register(){
    if(this.mailValidation(this.email)){
      if(this.email.toLowerCase() === this.reEmail.toLowerCase()){
        //Register user
        this.authService.register(this.email, this.name)
          .then(() => {
            this.showVerify = true;
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

  reSend(){
    this.authService.register(this.authService.email.getValue(), this.authService.name.getValue())
      .then((res) => {
        this.msgService.showMessage('inform', 'The verifiction code sent to the ' + this.authService.email.getValue());
      })
      .catch((err) => {
        this.msgService.showMessage('error', err);
      });
  }

  changeMail(){
    this.authService.removeUser();
    this.showVerify = false;
  }

  verify(code){
    if(!this.checkCode(code)){
      this.msgService.showMessage('warn', 'The verification code should contain 6 digits');
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
}
