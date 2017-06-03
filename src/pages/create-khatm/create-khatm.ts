import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {QuranService} from "../../services/quran.service";

@IonicPage()
@Component({
  selector: 'page-create-khatm',
  templateUrl: 'create-khatm.html',
})
export class CreateKhatmPage {
  range: string = 'whole';
  suraNumber: number = 1;
  suras: [] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private quranService: QuranService) {
  }

  onInit(){

  }

}
