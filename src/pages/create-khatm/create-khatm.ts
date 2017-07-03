import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {SocialSharing} from '@ionic-native/social-sharing';
import {Clipboard} from "@ionic-native/clipboard";
import * as moment from 'moment-timezone';

import {QuranService} from "../../services/quran.service";
import {LanguageService} from "../../services/language";
import {KhatmService} from "../../services/khatm.service";
import {MsgService} from "../../services/msg.service";
import {CommitmentPage} from "../commitment/commitment";
import {StylingService} from "../../services/styling";

@IonicPage()
@Component({
  selector: 'page-create-khatm',
  templateUrl: 'create-khatm.html',
})
export class CreateKhatmPage implements OnInit{
  basicShareLink: string = 'home/khatm/';
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
  conditionalColoring: any = {
    background: 'normal_back',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };
  isChangingCommitments: boolean =  false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private quranService: QuranService, private ls: LanguageService,
              private khatmService: KhatmService, private msgService: MsgService,
              private socialSharing: SocialSharing, private clipboard: Clipboard,
              private loadingCtrl: LoadingController, private stylingService: StylingService) {
    this.suras = this.quranService.getAllSura();
  }

  ngOnInit(){
    this.isNew = this.navParams.get('isNew');
    this.khatm = this.navParams.get('khatm');

    if(this.khatm !== null){
      // this.endDate = moment(this.khatm.end_date).format('YYYY-MMM-DD');
      // this.startDate = moment(this.khatm.start_date).format('YYYY-MMM-DD');
      this.startDateDisplay = this.ls.convertDate(this.khatm.start_date);
      this.endDateDisplay = this.ls.convertDate(this.khatm.end_date);

      let mDate = moment(this.currentDate);
      if(moment(this.khatm.start_date) > mDate)
        this.khatmIsStarted = false;
      else
        this.khatmIsStarted = true;

      this.rest_days = moment(this.khatm.end_date).diff(mDate, 'days');
      if(this.rest_days !== 0 || parseInt(mDate.format('D')) !== parseInt(moment(this.khatm.end_date).format('D')))
        this.rest_days++;
    }
    else{
      this.startDate = this.currentDate.getFullYear() + '-' +
          this.getFormattedDate(this.currentDate.getMonth(), true) + '-' +
          this.getFormattedDate(this.currentDate.getDate(), false);

      // this.startDate = this.ls.convertDate(this.startDate);
    }

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
  }

  submit(){
    this.rangeDisplay = (this.range === 'whole') ? 'Whole Quran' : 'Specific Sura';
    this.isSubmitted = false;

    console.log('NUMBER: ' + this.suraNumber);

    //Check validation
    if(this.name === null || this.name === '')
      this.msgService.showMessage('warn', 'The khatm should have a name');
    else if(this.endDate === null)
      this.msgService.showMessage('warn', 'The end date field cannot be empty');
    else if(this.endDate < this.startDate)
      this.msgService.showMessage('warn', 'The start date cannot be later then end date');
    else if(this.range === 'sura' && (this.suraNumber === null || this.suraNumber === 0))
      this.msgService.showMessage('warn', 'Please choose sura');
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
          this.msgService.showMessage('inform', 'Your khatm created successfully');
          this.navCtrl.popToRoot();
        })
        .catch((err) => {
          this.msgService.showMessage('warn', 'Cannot save your khamt now. Please try again');
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
      this.msgService.showMessage('warn', 'Please choose valid start date', true);
      this.submitDisability = true;
      return;
    }

    //Check all date validation
    if(!moment(this.startDate).isValid){
      this.msgService.showMessage('warn', 'Please choose the valid start date', true);
      this.startDate = null;
      this.submitDisability = true;
      return;
    }
    else if(!moment(this.endDate).isValid){
      this.msgService.showMessage('warn', 'Please choose the valid end date', true);
      this.endDate = null;
      this.submitDisability = true;
      return;
    }

    if(this.lastFocus === 'start'){
      if(currentFocus === 'start'){
        if(this.isFirstLess(startDate, currentDate)){
          this.startDate = this.castDate(currentDate);
          this.msgService.showMessage('warn', 'Please choose valid start date', true);
          this.submitDisability = true;
          return;
        }

        if(this.duration !== null && this.duration !== '')
          this.startDate = this.castDate(this.getDate(this.startDate, this.duration, null));
      }
      else if(currentFocus === 'end'){
        if(this.isFirstLess(endDate, startDate)){
          this.endDate = null;
          this.msgService.showMessage('warn', 'Please choose valid end date', true);
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
            this.msgService.showMessage('warn', 'The duration cannot be greater than 10 years');
            this.submitDisability = true;
            return;
          }
          else
            this.endDate = this.castDate(this.getDate(startDate, this.duration, null));
        }
      }
    }
    else if(this.lastFocus === 'end'){
      if(currentFocus === 'start'){
        if(this.isFirstLess(startDate, currentDate)){
          this.startDate = this.castDate(currentDate);
          this.msgService.showMessage('warn', 'Please choose valid start date', true);
          this.submitDisability = true;
          return;
        }
        else
          this.duration = this.getDate(startDate, null, endDate);
      }
      else if(currentFocus === 'end'){
        if(this.isFirstLess(endDate, currentDate)){
          this.endDate = null;
          this.msgService.showMessage('warn', 'Please choose valid end date', true);
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
            this.msgService.showMessage('warn', 'The duration value cannot be negative', true);
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
          this.msgService.showMessage('warn', 'The start date cannot be less than current date', true);
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
          this.msgService.showMessage('warn', 'The end date cannot be less than current date', true);
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
            this.msgService.showMessage('warn', 'The duration value cannot be negative', true);
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
    let link: string = 'http://quranApp/' + this.basicShareLink + this.khatm.share_link;
    this.clipboard.copy(link);
  }

  shareVia(){
    let message: string = 'Join to this khatm\n';
    let link: string = 'quranApp://' + this.basicShareLink + this.khatm.share_link;
    let tlink: string = '<html><head></head><body><a>'+this.basicShareLink + this.khatm.share_link+'</a></body></html>';

    this.socialSharing.share(message + '\n' + link, 'Khatm share link', null, tlink)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err.message);
        });
  }

  changeCommitPages(data){
    let newVal = data.target.value;
    let newValNum = parseInt(newVal);
    if(newVal.toString() === '')
      newValNum = 0;

    if(newVal !== null && newVal !== undefined && newValNum !== this.khatm.you_unread){
      //Start loading controller
      let loading = this.loadingCtrl.create({
        content: 'Please wait until save changes ...'
      });

      //update commit page for khatm
      let type = (newValNum < (this.khatm.you_unread === null ? 0 : this.khatm.you_unread)) ? 'delete' : 'add';
      this.khatmService.getPages(newValNum, this.khatm.khid, type)
          .then((res) => {
            this.khatm.you_unread = (newValNum === 0) ? null : newValNum;
            this.khatm.you_read = (this.khatm.you_read === null) ? 0 : this.khatm.you_read;

            //Stop loading controller
            loading.dismiss();
            this.isChangingCommitments = false;

            this.msgService.showMessage('inform', 'The requested pages assigned to you');
          })
          .catch((err) => {
            //Stop loading controller
            loading.dismiss();
            this.isChangingCommitments = false;

            console.log(err.message);
            this.msgService.showMessage('warn', 'Cannot assing you requested pages');
          });
    }
    else
      this.isChangingCommitments = false;
  }

  goToCommitment(isSelect){
    this.navCtrl.push(CommitmentPage, {khatm: this.khatm, isSelect: isSelect});
  }

  start_stop_Khatm(){
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

  limitClick(){
    this.isChangingCommitments = true;
  }
}
