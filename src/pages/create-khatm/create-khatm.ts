import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SocialSharing} from '@ionic-native/social-sharing';
import {Clipboard} from "@ionic-native/clipboard";
import * as moment from 'moment-timezone';

import {QuranService} from "../../services/quran.service";
import {LanguageService} from "../../services/language";
import {KhatmService} from "../../services/khatm.service";
import {MsgService} from "../../services/msg.service";

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private quranService: QuranService, private ls: LanguageService,
              private khatmService: KhatmService, private msgService: MsgService,
              private socialSharing: SocialSharing, private clipboard: Clipboard) {
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
      if(this.khatm.start_date > mDate)
        this.khatmIsStarted = false;
      else
        this.khatmIsStarted = true;
    }
    else{
      this.startDate = this.currentDate.getFullYear() + '-' +
          this.getFormattedDate(this.currentDate.getMonth(), true) + '-' +
          this.getFormattedDate(this.currentDate.getDate(), false);

      // this.startDate = this.ls.convertDate(this.startDate);
    }
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

  changeDuration(currentFocus){
    var mDate = moment(this.currentDate);

    if(currentFocus === 'end' && this.endDate < this.startDate){
      this.msgService.showMessage('warn', 'Please choose correct date');
      this.startDate = this.castDate(mDate);
      this.duration = null;
      this.endDate = null;
      return;
    }

    if(this.lastFocus === 'start'){
      if(currentFocus === 'end'){
        this.duration = this.getDate(this.startDate, null, this.endDate);
        this.lastFocus = currentFocus;
        console.log(this.duration);
      }
      else if(currentFocus === 'duration' || currentFocus === 'start'){
        if(this.duration === null || this.duration === 0)
          return;

        var e = this.getDate(this.startDate, this.duration, null);
        if(e > mDate.add(10, 'years')) {
          this.msgService.showMessage('warn', 'The end date cannot great than 10 year later');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else{
          this.endDate = this.castDate(e);
          this.lastFocus = currentFocus;
          console.log(this.endDate);
        }
      }
    }
    else if(this.lastFocus === 'duration'){
      if(currentFocus === 'start' || currentFocus === 'duration'){
        if(currentFocus === 'duration' && (this.duration === null || this.duration === 0))
          return;

        var e = this.getDate(this.startDate, this.duration, null);
        if(e > mDate.add(10, 'years')) {
          this.msgService.showMessage('warn', 'The end date cannot great than 10 year later');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else {
          this.endDate = this.castDate(e);
          this.lastFocus = currentFocus;
          console.log(this.endDate);
        }
      }
      else if(currentFocus === 'end'){
        var s = this.getDate(null, this.duration, this.endDate);
        if(s < mDate) {
          this.msgService.showMessage('warn', 'The start date cannot less than current date');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else if(s > mDate.add(1, 'years')) {
          this.msgService.showMessage('warn', 'The start date cannot great than 1 year later');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else {
          this.startDate = this.castDate(s);
          this.lastFocus = currentFocus;
          console.log(this.startDate);
        }
      }
    }
    else if(this.lastFocus === 'end'){
      if(currentFocus === 'start'){
        this.duration = this.getDate(this.startDate, null, this.endDate);
        this.lastFocus = currentFocus;
        console.log(this.duration);
      }
      else if(currentFocus === 'duration' || currentFocus === 'end'){
        if(this.duration === null || this.duration === 0)
          return;

        var s = this.getDate(null, this.duration, this.endDate);
        if(s < mDate) {
          this.msgService.showMessage('warn', 'The start date cannot less than current date');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else if(s > mDate.add(1, 'years')) {
          this.msgService.showMessage('warn', 'The start date cannot great than 1 year later');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else {
          this.startDate = this.castDate(s);
          this.lastFocus = currentFocus;
          console.log(this.startDate);
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
}
