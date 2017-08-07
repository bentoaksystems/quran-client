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
      content: this.ls.translate('Please wait until we get khatm details...'),
      cssClass: ((this.stylingService.nightMode) ? 'night_mode' : 'day_mode') + ' waiting'
    });
    let waitingIsShown: boolean = false;

    //Style back button
    if(this.ls.direction() === 'rtl')
      this.navBar.setElementClass('persian', true);
    else
      this.navBar.setElementClass('persian', false);

    let link = this.navParams.get('link');

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
            this.khatm = res;

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

            if(this.khatmService.activeKhatm.getValue() !== null && this.khatmService.activeKhatm.getValue().khid === this.khatm.khid)
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
            this.khatmService.getKhatm(link)
              .then(res => {
                this.khatm = res;

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

                if(this.khatmService.activeKhatm.getValue() !== null && this.khatmService.activeKhatm.getValue().khid === this.khatm.khid)
                  this.isAutomaticCommit = this.khatmService.isAutomaticCommit;

                waiting_loading.dismiss();
              })
              .catch(err => {
                if (err === 'expired')
                  this.msgService.showMessage('error', this.ls.translate('The khatm end date is passed'));
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
                  title: this.ls.translate('Not log in yet'),
                  message: this.ls.translate('You must be logged in to join to this khatm'),
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
    else if(this.endDate === null)
      this.msgService.showMessage('warn', this.ls.translate('The end date field cannot be empty'));
    else if(this.endDate < this.startDate)
      this.msgService.showMessage('warn', this.ls.translate('The start date cannot be later then end date'));
    else if(this.range === 'sura' && (this.suraNumber === null || this.suraNumber === 0))
      this.msgService.showMessage('warn', this.ls.translate('Please choose sura'));
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
      repeats: this.repeats
    };

    this.khatmService.createKhatm(khatmData)
        .then((res) => {
          this.msgService.showMessage('inform', this.ls.translate('Your khatm created successfully'));
          this.navCtrl.pop();
        })
        .catch((err) => {
          this.msgService.showMessage('warn', this.ls.translate('Cannot save your khamt now. Please try again'));
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
      this.msgService.showMessage('warn', this.ls.translate('Please choose valid start date'), true);
      this.submitDisability = true;
      return;
    }

    //Check all date validation
    if(!moment(this.startDate).isValid){
      this.msgService.showMessage('warn', this.ls.translate('Please choose the valid start date'), true);
      this.startDate = null;
      this.submitDisability = true;
      return;
    }
    else if(!moment(this.endDate).isValid){
      this.msgService.showMessage('warn', this.ls.translate('Please choose the valid end date'), true);
      this.endDate = null;
      this.submitDisability = true;
      return;
    }

    if(this.lastFocus === 'start'){
      if(currentFocus === 'start'){
        if(this.isFirstLess(startDate, currentDate)){
          this.startDate = this.castDate(currentDate);
          this.msgService.showMessage('warn', this.ls.translate('Please choose the valid start date'), true);
          this.submitDisability = true;
          return;
        }

        if(this.duration !== null && this.duration !== '')
          this.startDate = this.castDate(this.getDate(this.startDate, this.duration, null));
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
          if (this.duration > (365 * 10)) {
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
          this.msgService.showMessage('warn', 'Please choose the valid start date', true);
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
          this.msgService.showMessage('warn', this.ls.translate('The start date cannot be less than current date'), true);
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
          this.msgService.showMessage('warn', this.ls.translate('The end date cannot be less than current date'), true);
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
        content: this.ls.translate('Please wait until save changes') + ' ...'
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
                this.msgService.showMessage('inform', res + ' ' + this.ls.translate('pages are assigned to you'));
              }
              else{
                this.khatm.commitment_pages = parseInt(this.khatm.commitment_pages) - (parseInt(this.khatm.you_unread) - parseInt(res));
                this.msgService.showMessage('inform', (parseInt(this.khatm.you_unread) - parseInt(res)) + ' ' + this.ls.translate('pages get down from your commitments'));
                this.khatm.you_unread = (newValNum === 0) ? null : res;
              }
            }

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
    this.navCtrl.push(CommitmentPage, {khatm: this.khatm, isSelect: isSelect});
  }

  start_stop_Khatm(action){
    if(action === 'start')
      this.isAutomaticCommit = this.khatmService.isAutomaticCommit;
    else
      this.isAutomaticCommit = false;

    this.khatmService.start_stop_Khatm(this.khatm);

    if(this.khatmService.activeKhatm.getValue() !== null)
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
    if((this.isChangingCommitments && !this.isCommit) || (!this.isMember && !this.isChangingCommitments && !this.isCommit)){
      if(this.isMember){
        this.alertCtrl.create({
          title: this.ls.translate('Confirm Commit Pages'),
          message: this.ls.translate('Do you want to save your changes on commit pages?'),
          buttons: [
            {
              text: this.ls.translate('Cancel'),
              role: 'cancel'
            },
            {
              text: this.ls.translate('No'),
              handler: () => {
                this.khatmService.loadKhatms();
                this.navCtrl.pop();
              }
            },
            {
              text: this.ls.translate('Yes'),
              handler: () => {
                console.log(this.commitPageInput);
                this.changeCommitPages(this.commitPageInput.value);
              }
            }
          ],
          cssClass: ((this.stylingService.nightMode) ? 'night_mode' : 'day_mode') + ' alert'
        }).present();
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
        message: this.ls.translate('Your commitment page number is changed. Would you like to save it?'),
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

  toggleKhatmStatus(){
    this.khatmService.isAutomaticCommit = this.isAutomaticCommit;

    if(this.isAutomaticCommit)
      this.msgService.showMessage('inform', this.ls.translate('Note: Automatically mark any pages you read as read on "reading khatm" mode'), true);
    else
      this.msgService.showMessage('inform', this.ls.translate('Note: No pages mark as read on "reading khatm" mode. You should commit them manually from "committed pages" button'), true);
  }
}
