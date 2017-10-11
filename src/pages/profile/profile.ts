import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingController, Navbar, NavController, NavParams} from 'ionic-angular';

import {LanguageService} from "../../services/language";
import {StylingService} from "../../services/styling";
import {HttpService} from "../../services/http.service";
import {AuthService} from "../../services/auth.service";
import {CreateKhatmPage} from "../create-khatm/create-khatm";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit{
  @ViewChild(Navbar) navBar: Navbar;
  personData: any = null;
  personError: string = null;
  khatmData: any = null;
  khatmError: string = null;
  which_stat: string = 'created';
  waiting: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private ls: LanguageService, private stylingService: StylingService,
              private httpService: HttpService, private authService: AuthService,
              private loadingCtrl: LoadingController) {}

  ngOnInit(){
    this.navBar.setBackButtonText(this.ls.translate('Back'));

    //Style back button
    if(this.ls.direction() === 'rtl')
      this.navBar.setElementClass('persian', true);
    else
      this.navBar.setElementClass('persian', false);

    this.waiting = this.loadingCtrl.create({
      content: this.ls.translate('Please wait ...')
    });

    this.waiting.present();

    let getPersonResult: boolean = false;
    let getStatResult: boolean = false;

    this.httpService.getData('profile/person', true).subscribe(
      (data) => {
        this.personData = data.json();
        this.personError = null;
        getPersonResult = true;

        this.checkLoading(getPersonResult, getStatResult);
      },
      (err) => {
        this.personData = null;
        this.personError = 'Cannot fetch your personal data. Please try again';
        getPersonResult = true;

        this.checkLoading(getPersonResult, getStatResult);
      }
    );

    this.httpService.getData('profile/statistical', true).subscribe(
      (data) => {
        this.khatmData = data.json();
        this.khatmError = null;
        getStatResult = true;

        this.checkLoading(getPersonResult, getStatResult);
      },
      (err) => {
        this.khatmData = null;
        this.khatmError = 'Cannot fetch your khatm statistical data. Please try again';
        getStatResult = true;

        this.checkLoading(getPersonResult, getStatResult);
      }
    );

    this.stylingService.nightMode$.subscribe(
      (data) => {
        if(data) {
          this.navBar.setElementClass('night_mode', true);
          this.navBar.setElementClass('day_mode', false);
        }
        else{
          this.navBar.setElementClass('night_mode', false);
          this.navBar.setElementClass('day_mode', true);
        }
      }
    );
  }

  checkLoading(personResult, statResult){
    if(personResult && statResult)
      this.waiting.dismiss();
  }

  logout(){
    this.authService.logout();
    this.navCtrl.popToRoot();
  }

  oppositeDirection(){
    if(this.ls.direction() === 'rtl')
      return 'left';
    else
      return 'right';
  }

  gotoKhatm(shareLink){
    this.navCtrl.push(CreateKhatmPage, {link: shareLink, isExpired: true});
  }
}
