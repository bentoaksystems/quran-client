import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, Navbar, AlertController, App} from 'ionic-angular';
import {SocialSharing} from '@ionic-native/social-sharing';
import {Clipboard} from "@ionic-native/clipboard";
import * as moment from 'moment-timezone';

import {QuranService} from "../../services/quran.service";
import {LanguageService} from "../../services/language";
import {KhatmService} from "../../services/khatm.service";
import {MsgService} from "../../services/msg.service";
import {CommitmentPage} from "../commitment/commitment";
import {StylingService} from "../../services/styling";
import {AuthService} from "../../services/auth.service";
import {Registration} from "../registration/registration";

@IonicPage()
@Component({
  selector: 'page-create-khatm',
  templateUrl: 'create-khatm.html',
})
export class CreateKhatmPage implements OnInit, AfterViewInit{
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild('commitPageInput') commitPageInput;
  basicShareLink: string = 'http://read.quran.parts/khatm/';
  khatmIsStarted: boolean = true;
  isSubmitted: boolean = false;
  name: string = '';
  description: string = '';
  ownerShown: boolean = true;
  range: string = 'whole';
  rangeDisplay: string = 'Whole Quran';
  suraNumber: number = 1;
  suras = [];
  repeats: number = 1;
  everyday: boolean = false;
  page_per_day: number = 3;
  currentDate = new Date();
  startDate;
  startDateDisplay: string;
  endDate;
  endDateDisplay: string;
  isNew: boolean = false;
  khatm: any;
  submitDisability: boolean = true;
  duration;
  lastFocus: string = 'start';
  rest_days: number = null;
  isChangingCommitments: boolean =  false;
  isMember: boolean = false;
  isCommit: boolean = false;
  isAutomaticCommit: boolean = false;
  isExpiredKhatm: boolean = false;
  isJoinedEverydayKhatm: boolean = false;

  constructor(public navCtrl: NavController, private navParams: NavParams,
              private quranService: QuranService, private ls: LanguageService,
              private khatmService: KhatmService, private msgService: MsgService,
              private socialSharing: SocialSharing, private clipboard: Clipboard,
              private loadingCtrl: LoadingController, private stylingService: StylingService,
              private alertCtrl: AlertController, private authService: AuthService,
              public appCtrl: App) {
    this.suras = this.quranService.getAllSura();
  }

  ngOnInit(){
    this.navBar.setBackButtonText(this.ls.translate('Back'));

    let waiting_loading = this.loadingCtrl.create({
      content: this.ls.translate('Please wait until your khatms are loaded ...'),
      cssClass: ((this.stylingService.nightMode) ? 'night_mode' : 'day_mode') + ' waiting'
    });
    let waitingIsShown: boolean = false;

    //Style back button
    if(this.ls.direction() === 'rtl')
      this.navBar.setElementClass('persian', true);
    else
      this.navBar.setElementClass('persian', false);

    let link = this.navParams.get('link');
    this.isExpiredKhatm = (this.navParams.get('isExpired') ? this.navParams.get('isExpired') : false);

    if(link === undefined || link === null){
      this.isNew = this.navParams.get('isNew');
      // this.khatm = this.navParams.get('khatm');
      this.khatm = null;
      let tempShareLink = this.navParams.get('khatm');
      this.isMember = this.navParams.get('isMember');

      if(tempShareLink !== null){
        waiting_loading.present();

        this.khatmService.getKhatm(tempShareLink)
          .then(res => {
            if(res === null || res === undefined){
              waiting_loading.dismiss();
              this.khatm = null;
              this.msgService.showMessage('inform', this.ls.translate('Cannot get khatm details. Maybe this khatm is expired'));
              this.khatmService.deleteNotJoinSeenKhatms(tempShareLink);
              return;
            }

            this.khatm = res;
            this.isJoinedEverydayKhatm = this.khatm.join_khid ? this.khatm.join_khid : false;

            // this.endDate = moment(this.khatm.end_date).format('YYYY-MMM-DD');
            // this.startDate = moment(this.khatm.start_date).format('YYYY-MMM-DD');
            this.startDateDisplay = this.ls.convertDate(this.khatm.start_date);
            this.endDateDisplay = this.ls.convertDate(this.khatm.end_date);

            this.khatm.you_unread = parseInt(this.khatm.you_unread) === 0 ? null : this.khatm.you_unread;

            let mDate = moment(this.currentDate);
            if(moment(this.khatm.start_date) > mDate)
              this.khatmIsStarted = false;
            else
              this.khatmIsStarted = true;

            this.rest_days = moment(this.khatm.end_date).diff(mDate, 'days');
            if(this.rest_days !== 0 || parseInt(mDate.format('D')) !== parseInt(moment(this.khatm.end_date).format('D')))
              this.rest_days++;

            this.isAutomaticCommit = this.khatmService.isAutomaticCommit;

            waiting_loading.dismiss();
          })
          .catch(err => {
            this.khatm = null;
            this.msgService.showMessage('error', this.ls.translate('Cannot get khatm details'));
            waiting_loading.dismiss();
          });
      }
      else{
        this.startDate = this.currentDate.getFullYear() + '-' +
          this.getFormattedDate(this.currentDate.getMonth(), true) + '-' +
          this.getFormattedDate(this.currentDate.getDate(), false);

        // this.startDate = this.ls.convertDate(this.startDate);
      }
    }
    else{
      this.isNew = false;
      this.khatm = null;
      this.isMember = false;

      let stillNotLoggedIn: boolean = true;
      let visited: boolean = false;
      let authAlert;
      let authAlertIsShown: boolean = false;

      if(this.authService.isLoggedIn.getValue()){
        waiting_loading.present();
        waitingIsShown = true;
      }

      this.authService.isLoggedIn.subscribe(
        (status) => {
          if (status) {
            stillNotLoggedIn = false;
            if(authAlertIsShown)
              authAlert.dismiss();
            if(!waitingIsShown)
              waiting_loading.present();
            this.khatmService.getKhatm(link, this.isExpiredKhatm)
              .then(res => {
                if(res === null || res === undefined){
                  waiting_loading.dismiss();
                  this.msgService.showMessage('inform', this.ls.translate('Cannot get khatm details. Maybe this khatm is expired'));
                }
                else{
                  this.khatm = res;

                  this.isJoinedEverydayKhatm = this.khatm.join_khid ? this.khatm.join_khid : false;
                  this.startDateDisplay = this.ls.convertDate(this.khatm.start_date);
                  this.endDateDisplay = this.ls.convertDate(this.khatm.end_date);

                  let mDate = moment(this.currentDate);
                  if (moment(this.khatm.start_date) > mDate)
                    this.khatmIsStarted = false;
                  else
                    this.khatmIsStarted = true;

                  this.rest_days = moment(this.khatm.end_date).diff(mDate, 'days');
                  if (this.rest_days !== 0 || parseInt(mDate.format('D')) !== parseInt(moment(this.khatm.end_date).format('D')))
                    this.rest_days++;

                  this.isMember = (this.khatm.you_read !== null && this.khatm.you_unread !== null);

                  this.isAutomaticCommit = this.khatmService.isAutomaticCommit;

                  waiting_loading.dismiss();
                }
              })
              .catch(err => {
                if (err === 'expired')
                  this.msgService.showMessage('error', this.ls.translate('The khatm end date is in the past'));
                else {
                  this.msgService.showMessage('error', this.ls.translate('Cannot get khatm details'));
                }

                waiting_loading.dismiss();
              });
          }
          else if (!status && !visited) {
            visited = true;
            setTimeout(() => {
              if (stillNotLoggedIn && !this.authService.isLoggedIn.getValue()) {
                stillNotLoggedIn = false;
                authAlert = this.alertCtrl.create({
                  title: this.ls.translate('Not logged in yet'),
                  message: this.ls.translate('You must log in to join this khatm'),
                  buttons: [
                    {
                      text: 'Register',
                      handler: () => {
                        this.appCtrl.getRootNav().push(Registration, {data: {fromButton: 'register'}});
                      }
                    },
                    {
                      text: 'Sign In',
                      handler: () => {
                        this.appCtrl.getRootNav().push(Registration, {data: {fromButton: 'signin'}});
                      }
                    },
                    {
                      text: 'Cancel',
                      handler: () => {
                        this.appCtrl.getRootNav().pop();
                      }
                    }
                  ],
                  cssClass: ((this.stylingService.nightMode) ? 'night_mode' : 'day_mode') + ' alert'
                });
                authAlertIsShown = true;
                authAlert.present();
              }
            }, 1500)
          }
        });
    }

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

    this.navBar.backButtonClick = (e:UIEvent) => {
      this.checkOnLeft();
    }
  }

  ngAfterViewInit(){
    if(this.commitPageInput) {
      this.commitPageInput._elementRef.nativeElement.firstElementChild.focus();
    }
  }

  submit(){
    this.rangeDisplay = (this.range === 'whole') ? 'Whole Quran' : 'Specific Sura';
    this.isSubmitted = false;

    //Check validation
    if(this.name === null || this.name === '')
      this.msgService.showMessage('warn', this.ls.translate('The khatm should have a name'));
    else if(this.repeats === null || this.repeats === 0)
      this.msgService.showMessage('warn', this.ls.translate('The repeats must be greater than 0'));
    else if(this.endDate === null)
      this.msgService.showMessage('warn', this.ls.translate('The end date field cannot be left blank'));
    else if(this.endDate < this.startDate)
      this.msgService.showMessage('warn', this.ls.translate('The start date cannot be later than end date'));
    else if(this.range === 'sura' && (this.suraNumber === null || this.suraNumber === 0))
      this.msgService.showMessage('warn', this.ls.translate('Please choose sura'));
    else if(this.everyday && (this.page_per_day === null || this.page_per_day === undefined || this.page_per_day <= 0))
      this.msgService.showMessage('warn', this.ls.translate('The page per day must be greater than 0'));
    else {
      this.isSubmitted = true;

      if(this.ls.lang === 'fa'){
        this.startDateDisplay = this.convertNumbers(this.ls.convertDate(this.startDate),'fa');
        this.endDateDisplay = this.convertNumbers(this.ls.convertDate(this.endDate),'fa');
      }
      else if(this.ls.lang === 'ar'){
        this.startDateDisplay = this.ls.convertDate(this.startDate).toLocaleString('ar');
        this.endDateDisplay = this.ls.convertDate(this.endDate).toLocaleString('ar');
      }
      else{
        this.startDateDisplay = this.ls.convertDate(this.startDate);
        this.endDateDisplay = this.ls.convertDate(this.endDate);
      }
    }

  }

  convertNumbers(str, region){
    return str.split('').map(c=>{
      if(!isNaN(+c)){
        return (+c).toLocaleString(region);
      }
      else return c;
    }).join('');
  }

  create(){
    let khatmData = {
      name: this.name,
      description: this.description,
      creator_shown: this.ownerShown,
      start_date: this.startDate,
      end_date: this.endDate,
      timezone:  moment.tz(moment.tz.guess()).format('z'),
      specific_sura: (this.range === 'whole') ? null : this.suraNumber,
      repeats: this.repeats,
      is_everyday: this.everyday,
      page_per_day: this.page_per_day
    };

    this.khatmService.createKhatm(khatmData)
        .then((res) => {
          this.msgService.showMessage('inform', this.ls.translate('Your khatm is created successfully'));
          this.navCtrl.pop();
        })
        .catch((err) => {
          this.msgService.showMessage('warn', this.ls.translate('Cannot save your khatm now. Please try again'));
        })
  }

  getFormattedDate(num, isMonth){
    let n = isMonth ? num + 1 : num;

    if(n >=1 && n <= 9)
      return '0' + n.toString();
    else
      return n.toString();
  }

  checkDisability(){
    if(this.name.trim() === '' || this.name === null)
      this.submitDisability = true;
    else if(this.repeats < 0)
      this.submitDisability = true;
    else if(this.endDate === undefined || this.endDate === null || (this.endDate < this.startDate))
      this.submitDisability = true;
    else if(this.everyday && (this.page_per_day === null || this.page_per_day === undefined || this.page_per_day <= 0))
      this.submitDisability = true;
    else
      this.submitDisability = false;
  }

  changeDuration(currentFocus, newVal){
    let currentDate = moment(this.currentDate);
    let startDate = (currentFocus === 'start') ? moment(newVal) : moment(this.startDate);
    let endDate = (currentFocus === 'end') ? moment(newVal) : moment(this.endDate);

    //Check start date validation
    if(this.isFirstLess(startDate, currentDate)){
      this.startDate = this.castDate(currentDate);
      this.msgService.showMessage('warn', this.ls.translate('Please choose a valid start date'), true);
      this.submitDisability = true;
      return;
    }

    //Check all date validation
    if(!moment(this.startDate).isValid){
      this.msgService.showMessage('warn', this.ls.translate('Please choose a valid start date'), true);
      this.startDate = null;
      this.submitDisability = true;
      return;
    }
    else if(!moment(this.endDate).isValid){
      this.msgService.showMessage('warn', this.ls.translate('Please choose a valid end date'), true);
      this.endDate = null;
      this.submitDisability = true;
      return;
    }

    if(this.lastFocus === 'start'){
      if(currentFocus === 'start'){
        if(this.isFirstLess(startDate, currentDate)){
          this.startDate = this.castDate(currentDate);
          this.msgService.showMessage('warn', this.ls.translate('Please choose a valid start date'), true);
          this.submitDisability = true;
          return;
        }

        if(this.duration !== null && this.duration !== '')
          this.endDate = this.castDate(this.getDate(this.startDate, this.duration, null));
      }
      else if(currentFocus === 'end'){
        if(this.isFirstLess(endDate, startDate)){
          this.endDate = null;
          this.msgService.showMessage('warn', 'Please choose the valid end date', true);
          this.submitDisability = true;
          return;
        }
        else
          this.duration = this.getDate(startDate, null, endDate);
      }
      else if(currentFocus === 'duration'){
        if(this.duration !== null && this.duration !== '') {
          if (this.duration > (365 * 10) && ((this.everyday && this.page_per_day) || (!this.everyday))) {
            this.duration = null;
            this.msgService.showMessage('warn', this.ls.translate('The duration cannot be greater than 10 years'));
            this.submitDisability = true;
            return;
          }
          else
            this.endDate = this.castDate(this.getDate(startDate, this.duration, null));
        }
        else{
          this.endDate = this.startDate;
        }
      }
    }
    else if(this.lastFocus === 'end'){
      if(currentFocus === 'start'){
        if(this.isFirstLess(startDate, currentDate)){
          this.startDate = this.castDate(currentDate);
          this.msgService.showMessage('warn', 'Please choose a valid start date', true);
          this.submitDisability = true;
          return;
        }
        else
          this.duration = this.getDate(startDate, null, endDate);
      }
      else if(currentFocus === 'end'){
        if(this.isFirstLess(endDate, currentDate)){
          this.endDate = null;
          this.msgService.showMessage('warn', 'Please choose the valid end date', true);
          this.submitDisability = true;
          return;
        }
        else
          this.duration = this.getDate(startDate, null, endDate);
      }
      else if(currentFocus === 'duration'){
        if(this.duration !== null && this.duration !== '') {
          if (this.duration < 0) {
            this.duration = null;
            this.msgService.showMessage('warn', this.ls.translate('The duration value cannot be negative'), true);
            this.submitDisability = true;
            return;
          }
          else {
            let tempStartDate = this.getDate(null, this.duration, endDate);

            if (this.isFirstLess(tempStartDate, currentDate)) {
              this.startDate = this.castDate(currentDate);
              this.endDate = this.castDate(endDate.add(currentDate.diff(tempStartDate, 'days'), 'days'));
            }
            else
              this.startDate = this.castDate(tempStartDate);
          }
        }
      }
    }
    else if(this.lastFocus === 'duration'){
      if(currentFocus === 'start'){
        if(this.isFirstLess(startDate, currentDate)){
          this.msgService.showMessage('warn', this.ls.translate('The start date cannot be before today'), true);
          this.startDate = this.castDate(currentDate);
          this.submitDisability = true;
          return;
        }
        else if(this.duration !== null && this.duration !== '')
          this.endDate = this.castDate(this.getDate(startDate, this.duration, null));
      }
      else if(currentFocus === 'end'){
        if(this.isFirstLess(endDate, currentDate)){
          this.endDate = null;
          this.msgService.showMessage('warn', this.ls.translate('The end date cannot be before today'), true);
          this.submitDisability = true;
          return;
        }
        else if(this.duration !== null && this.duration !== ''){
          let tempStartDate = this.getDate(null, this.duration, endDate);

          if(this.isFirstLess(tempStartDate, currentDate)){
            this.startDate = this.castDate(currentDate);
            this.endDate = this.castDate(endDate.add(currentDate.diff(tempStartDate, 'days'), 'days'));
          }
          else
            this.startDate = this.castDate(tempStartDate);
        }
      }
      else if(currentFocus === 'duration'){
        if(this.duration !== null && this.duration !== '') {
          if (this.duration < 0) {
            this.msgService.showMessage('warn', this.ls.translate('The duration value cannot be negative'), true);
            this.duration = null;
            this.submitDisability = true;
            return;
          }
          else
            this.endDate = this.castDate(this.getDate(startDate, this.duration, null));
        }
      }
    }

    this.checkDisability();
  }

  getDate(startDate, duration, endDate){
    if(startDate === null){
      var e = moment(endDate);
      var s = e.subtract(duration, 'days');
      return s;
    }
    else if(duration === null){
      var s = moment(startDate);
      var e = moment(endDate);
      return e.diff(s, 'days');
    }
    else if(endDate === null){
      var s = moment(startDate);
      var e = s.add(duration, 'days');
      return e;
    }

    return null;
  }

  castDate(a){
    let date = new Date(a.toObject().years, a.toObject().months, a.toObject().date);

    return date.getFullYear() + '-' + this.getFormattedDate(date.getMonth(), true) + '-' + this.getFormattedDate(date.getDate(), false);
  }

  oppositeDirection(){
    if(this.ls.direction() === 'rtl')
      return 'left';
    else
      return 'right';
  }

  copyLink(){
    let link: string = this.basicShareLink + this.khatm.share_link;
    this.clipboard.copy(link)
      .then(res => {
        this.msgService.showMessage('inform', res);
      })
      .catch(err => {
        this.msgService.showMessage('error', err);
      })
  }

  shareVia(){
    let message: string = (this.authService.user.getValue().name !== null) ? this.authService.user.getValue().name + " invite you" : "You invited";
    message += " to join to '" + this.khatm.khatm_name + "' khatm";

    let link: any = this.basicShareLink + this.khatm.share_link;

    this.socialSharing.share(message, "Join to kahtm", null, link)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err.message);
        });
  }

  changeCommitPages(data){
    // let newVal = data.target.value;
    let newVal = data;
    let newValNum = parseInt(newVal);
    if(newVal.toString() === '')
      newValNum = 0;

    if(!this.isMember){
      this.isCommit = !(newValNum === 0);
    }

    if(newVal !== null && newVal !== undefined && newValNum !== this.khatm.you_unread) {
      //Start loading controller
      let loading = this.loadingCtrl.create({
        content: this.ls.translate('please wait until changes are saved') + ' ...'
      });

      //update commit page for khatm
      let type = (newValNum < (this.khatm.you_unread === null ? 0 : this.khatm.you_unread)) ? 'delete' : 'add';

      if (type === 'add' && this.khatm.commitment_pages >= this.khatm.repeats * 604) {
        this.commitPageInput.value = this.khatm.you_unread;
        this.msgService.showMessage('warn', this.ls.translate('Sorry. All pages are committed'));
        this.isChangingCommitments = false;
      }
      else {
        loading.present();

        this.khatmService.getPages(newValNum, this.khatm.khid, type, this.isMember)
          .then((res: any) => {
            if(res !== null){
              this.khatm.commitment_pages = (this.khatm.commitment_pages === null) ? 0 : this.khatm.commitment_pages;
              this.khatm.you_unread = (this.khatm.you_unread === null) ? 0 : this.khatm.you_unread;
              this.khatm.you_read = (this.khatm.you_read === null) ? 0 : this.khatm.you_read;

              if(type === 'add'){
                this.khatm.commitment_pages = parseInt(this.khatm.commitment_pages) + parseInt(res);
                this.khatm.you_unread = (newValNum === 0) ? null : (parseInt(this.khatm.you_unread) + parseInt(res));
                this.msgService.showMessage('inform', res + ' ' + this.ls.translate('The pages are assigned to you'));
              }
              else{
                this.khatm.commitment_pages = parseInt(this.khatm.commitment_pages) - (parseInt(this.khatm.you_unread) - parseInt(res));
                this.msgService.showMessage('inform', (parseInt(this.khatm.you_unread) - parseInt(res)) + ' ' + this.ls.translate('The pages were removed from your commitments'));
                this.khatm.you_unread = (newValNum === 0) ? null : res;
              }
            }

            return this.khatmService.getKhatmPages(this.khatm.khid);
          })
          .then(res => {
            if(this.khatm.owner_email.toLowerCase() === this.authService.user.getValue().email.toLowerCase())
              return Promise.resolve();
            else if(this.khatm.you_unread === null && (this.khatm.you_read === null || this.khatm.you_read == 0))
              return this.khatmService.saveNotJoinSeenKhatms(this.khatm.khatm_name, this.khatm.share_link, this.khatm.end_date);
            else if(this.khatm.you_unread === null && (this.khatm.you_read !== null || this.khatm.you_read != 0))
              return Promise.resolve();
            else
              return this.khatmService.deleteNotJoinSeenKhatms(this.khatm.share_link);
          })
          .then(res => {
            //Stop loading controller
            loading.dismiss();
            this.isChangingCommitments = false;
          })
          .catch((err) => {
            //Stop loading controller
            loading.dismiss();
            this.isChangingCommitments = false;
            this.commitPageInput.value = this.khatm.you_unread;

            console.log(err.message);
            this.msgService.showMessage('warn', this.ls.translate('Cannot assign you requested pages'));
            this.msgService.showMessage('error', JSON.stringify(err), true);
          });
      }
    }
    else
      this.isChangingCommitments = false;
  }

  goToCommitment(isSelect){
    this.navCtrl.push(CommitmentPage, {khatm: this.khatm, isSelect: isSelect, isMember: this.isMember});
  }

  start_stop_Khatm(action){
    this.isAutomaticCommit = this.khatmService.isAutomaticCommit;

    this.khatmService.start_stop_Khatm(this.khatm);

    if(action === 'start')
      this.navCtrl.popToRoot();
  }

  isFirstLess(aDate, bDate){
    return aDate.diff(bDate, 'days') < 0 ? true : false;
  }

  setDuration(){
    if(this.duration === null || this.duration === '')
      this.duration = this.getDate(moment(this.startDate), null, moment(this.endDate));
  }

  limitClick(value){
    if(value !== null || value !== undefined){
      let data: number = (value.toString() === '') ? 0 : parseInt(value);

      this.isChangingCommitments = (data !== parseInt(this.khatm.you_unread));
    }
    else
      this.isChangingCommitments = false;
  }

  checkOnLeft(){
    if(this.khatm && ((this.everyday && !this.isJoinedEverydayKhatm) || (this.isChangingCommitments && !this.isCommit) || (!this.isMember && !this.isChangingCommitments && !this.isCommit))){
      if(this.isMember){
        this.undoPageChange();
        this.navCtrl.pop();
      }
      else if(this.khatm.owner_email.toLowerCase() === this.authService.user.getValue().email.toLowerCase()){
        this.khatmService.loadKhatms();
        this.navCtrl.pop();
      }
      else{
        this.alertCtrl.create({
          title: this.ls.translate('Confirm Commit Pages'),
          message: this.ls.translate('You cannot join to this khatm unless commit some pages. Do you want to join this khatm?'),
          buttons: [
            {
              text: this.ls.translate('Interested To Join'),
              role: 'cancel'
            },
            {
              text: this.ls.translate('Uninterested To Join'),
              handler: () => {
                this.khatmService.saveNotJoinSeenKhatms(this.khatm.khatm_name, this.khatm.share_link, this.khatm.end_date);
                this.khatmService.loadKhatms();
                this.navCtrl.pop();
              }
            }
          ],
          cssClass: ((this.stylingService.nightMode) ? 'night_mode' : 'day_mode') + ' alert'
        }).present();
      }
    }
    else{
      this.khatmService.loadKhatms();
      this.navCtrl.pop();
    }
  }

  checkCommitmentStatus(value){
    if(value !== null && parseInt(value) !== parseInt(this.khatm.you_unread) && (this.khatm.you_unread !== null || (this.khatm.you_unread === null && (parseInt(value) !== 0 && value !== ''))))
      this.alertCtrl.create({
        title: this.ls.translate('Confirm Commit Pages'),
        message: this.ls.translate('Number of your committed pages is changed. Would you like to save it?'),
        buttons: [
          {
            text: this.ls.translate('Yes'),
            handler: () => {
              this.changeCommitPages(value);
            }
          },
          {
            text: this.ls.translate('No'),
            handler: () => {
              this.commitPageInput.value = this.khatm.you_unread;
              this.isChangingCommitments = false;
            }
          }
        ],
        cssClass: ((this.stylingService.nightMode) ? 'night_mode' : 'day_mode') + ' alert',
        enableBackdropDismiss: false
      }).present();
  }

  undoPageChange(){
    this.commitPageInput.value = this.khatm.you_unread;
    this.isChangingCommitments = false;
  }

  toggleKhatmStatus(){
    this.khatmService.isAutomaticCommit = this.isAutomaticCommit;

    if(this.isAutomaticCommit)
      this.msgService.showMessage('inform', this.ls.translate('In automatic mode the pages will be marked as "read" once you scroll them up'), true);
    else
      this.msgService.showMessage('inform', this.ls.translate('In manual mode you should come back to the khatm page and mark the pages as "read" yourself'), true);
  }

  changeEveryday(newVal){
    if(newVal !== null && newVal !== undefined){
      this.everyday = newVal;
      if(this.everyday) {
        this.msgService.showMessage('inform', this.ls.translate('The duration and end date are calculated based on one member. It\'s change when member number increases'), true);
        this.updateDuration();
      }
      else{
        this.duration = null;
        this.endDate = null;
      }
    }
    else if(this.everyday && this.page_per_day > 0 && this.page_per_day){
      this.updateDuration();
    }
    else if(this.page_per_day < 1){
      this.page_per_day = 1;
      this.updateDuration();
    }
  }

  updateDuration(){
    this.duration = Math.ceil((this.repeats * 604) / this.page_per_day);
    this.changeDuration('duration', this.duration);
  }

  joinEverydayKhatm(shouldJoin: boolean){
    if(!shouldJoin){
      if(parseInt(this.khatm.you_unread) > 0)
        this.alertCtrl.create({
          title: this.ls.translate('Commitments Alert'),
          message: this.ls.translate('You have some page to read. Cannot disjoint from this khatm'),
          buttons: [
            {
              text: this.ls.translate('OK'),
              role: 'cancel'
            },
          ]
        }).present();
      else
        this.alertCtrl.create({
          title: this.ls.translate('Disjoint confirmation'),
          message: this.ls.translate('Are you sure to disjoint this khatm?'),
          buttons: [
            {
              text: this.ls.translate('No'),
              role: 'cancel'
            },
            {
              text: this.ls.translate('Yes'),
              handler: () => {
                this.khatmService.joinEverydayKhatm(this.khatm.khid, shouldJoin).subscribe(
                  (data) => {
                    this.msgService.showMessage('inform', this.ls.translate('You disjoint from this khatm now'));
                    this.isJoinedEverydayKhatm = shouldJoin;
                    this.isMember = shouldJoin;
                  },
                  (err) => {
                    this.msgService.showMessage('error', this.ls.translate('Cannot disjoint you from khatm. Please try again'), true);
                    this.isJoinedEverydayKhatm = !shouldJoin;
                    this.isMember = !shouldJoin;
                  }
                );
              }
            }
          ]
        }).present();
    }
    else{
      this.khatmService.joinEverydayKhatm(this.khatm.khid, shouldJoin).subscribe(
        (data) => {
          this.msgService.showMessage('inform', this.ls.translate('You join to this khatm now'));
          this.isJoinedEverydayKhatm = shouldJoin;
          this.isMember = shouldJoin;
        },
        (err) => {
          this.msgService.showMessage('error', this.ls.translate('Cannot join you to this khatm. Please try again'), true);
          this.isMember = !shouldJoin;
          this.isJoinedEverydayKhatm = !shouldJoin;
        }
      )
    }
  }
}
