import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LanguageService} from "../../services/language";
import {KhatmService} from "../../services/khatm.service";
import {StylingService} from "../../services/styling";

@IonicPage()
@Component({
  selector: 'page-commitment',
  templateUrl: 'commitment.html',
})
export class CommitmentPage implements OnInit{
  khatm: any;
  isSelect: boolean = true;
  rowPages = [];
  startRange: any = null;
  endRange: any = null;
  allCommitments: any = [];
  conditionalColoring: any = {
    background: 'normal_back',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private ls: LanguageService, private khatmService: KhatmService,
              private stylingService: StylingService) {}

  ngOnInit(){
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

    this.khatm = this.navParams.get('khatm');
    this.isSelect = this.navParams.get('isSelect');

    this.rowPages = [];
    this.khatmService.getKhatmPages(this.khatm.khid)
      .then((value) => {
        this.allCommitments = value.sort((a, b) => {
          if(a.page_number > b.page_number)
            return 1;
          else if(a.page_number < b.page_number)
            return -1;
          else{
            if(a.repeat_number > b.repeat_number)
              return 1;
            else if(a.repeat_number < b.repeat_number)
              return -1;
            else
              return 0;
          }
        });
        this.createRows();
      })
      .catch((err) => console.log(err));
  }

  createRows(){
    let rowUpperBound = 6;
    let columnCounter = 0;
    let tempRow = [];

    this.allCommitments.forEach(el => {
      columnCounter++;
      if(columnCounter <= rowUpperBound){
        tempRow.push(el);
      }

      if(columnCounter === rowUpperBound || (columnCounter + this.rowPages.length * rowUpperBound) >= this.allCommitments.length){
        columnCounter = 0;
        this.rowPages.push(tempRow.slice(0, 7));
        tempRow = [];
      }
    });
  }

  commit(page){
    if(this.startRange !== null)
      this.selectRange(page);
    else {
      page.isread = !page.isread;
      this.khatm.you_read = (page.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
      this.khatm.you_unread = (page.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
      this.khatmService.commitPages(this.khatm.khid, [page], page.isread);
    }
  }

  selectRange(page){
    if(this.startRange === null) {
      page.isread = true;
      this.khatm.you_read = (page.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
      this.khatm.you_unread = (page.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
      this.startRange = page;
    }
    else if(this.endRange === null)
      this.endRange = page;

    if(this.startRange !== null && this.endRange !== null){
      //check the position of start/end range (change the position if needed)
      if(this.startRange.page_number > this.endRange.page_number){
        let tmp = this.startRange;
        this.startRange = this.endRange;
        this.endRange = tmp;
      }
      else if(this.startRange.page_number === this.endRange.page_number){
        if(this.startRange.repeat_number > this.endRange.repeat_number){
          let tmp = this.startRange;
          this.startRange = this.endRange;
          this.endRange = tmp;
        }
      }

      let pages = [];
      pages.push(this.startRange);

      this.allCommitments.forEach(el => {
        if((el.page_number > this.startRange.page_number ||
           (el.page_number === this.startRange.page_number && el.repeat_number > this.startRange.repeat_number)) &&
           (el.page_number < this.endRange.page_number ||
           (el.page_number === this.endRange.page_number && el.repeat_number <= this.endRange.repeat_number))){
            el.isread = !el.isread;
            this.khatm.you_read = (el.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
            this.khatm.you_unread = (el.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
            pages.push(el);
        }
      });

      let readPages = pages.filter(el => el.isread === true);
      let unreadPages = pages.filter(el => el.isread === false);

      if(readPages.length > 0)
        this.khatmService.commitPages(this.khatm.khid, readPages, true);
      if(unreadPages.length > 0)
        this.khatmService.commitPages(this.khatm.khid, unreadPages, false);

      this.startRange = null;
      this.endRange = null;
    }
  }
}
