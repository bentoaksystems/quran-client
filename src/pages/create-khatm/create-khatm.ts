import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  endDate;
  isNew: boolean = false;
  khatm: any;
  submitDisability: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private quranService: QuranService, private ls: LanguageService,
              private khatmService: KhatmService, private msgService: MsgService) {
    this.suras = this.quranService.getAllSura();
  }

  ngOnInit(){
    this.isNew = this.navParams.get('isNew');
    this.khatm = this.navParams.get('khatm');

    if(this.khatm !== null){
      // this.endDate = moment(this.khatm.end_date).format('YYYY-MMM-DD');
      // this.startDate = moment(this.khatm.start_date).format('YYYY-MMM-DD');
      this.startDate = this.ls.convertDate(this.khatm.start_date);
      this.endDate = this.ls.convertDate(this.khatm.end_date);
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

    //Check validation
    if(this.name === null || this.name === '')
      this.msgService.showMessage('warn', 'The khatm should have a name');
    else if(this.endDate === null)
      this.msgService.showMessage('warn', 'The end date field cannot be empty');
    else if(this.endDate < this.startDate)
      this.msgService.showMessage('warn', 'The start date cannot be later then end date');
    else {
      this.isSubmitted = true;
      this.startDate = this.ls.convertDate(this.startDate);
      this.endDate = this.ls.convertDate(this.endDate);
    }

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
    else if(this.endDate === null || (this.endDate < this.startDate))
      this.submitDisability = true;
    else
      this.submitDisability = false;
  }

  oppositeDirection(){
    console.log('oppositeDirection');
    if(this.ls.direction() === 'rtl')
      return 'left';
    else
      return 'right';
  }
}
