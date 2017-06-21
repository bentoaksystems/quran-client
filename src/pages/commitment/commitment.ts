import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LanguageService} from "../../services/language";
import {KhatmService} from "../../services/khatm.service";

@IonicPage()
@Component({
  selector: 'page-commitment',
  templateUrl: 'commitment.html',
})
export class CommitmentPage implements OnInit{
  khatm: any;
  isSelect: boolean = true;
  rowPages = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private ls: LanguageService, private khatmService: KhatmService) {}

  ngOnInit(){
    this.khatm = this.navParams.get('khatm');
    this.isSelect = this.navParams.get('isSelect');

    this.rowPages = [];
    let allCommitPages = [];
    this.khatmService.getKhatmPages(this.khatm.khid)
      .then((value) => {
        allCommitPages = value;
        this.createRows(allCommitPages);
      })
      .catch((err) => console.log(err));
  }

  createRows(allCommitPages){
    let rowUpperBound = 6;
    let columnCounter = 0;
    let tempRow = [];

    allCommitPages.sort((a, b) => {
      if(a.page_number > b.page_number)
        return 1;
      else if(a.page_number < b.page_number)
        return -1;
      else
        return 0;
    }).forEach(el => {
      columnCounter++;
      if(columnCounter <= rowUpperBound){
        tempRow.push(el);
      }
      else{
        columnCounter = 0;
        this.rowPages.push(tempRow.slice(0, 7));
        tempRow = [];
      }
    });
  }
}
