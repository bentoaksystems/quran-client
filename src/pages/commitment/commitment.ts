import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Navbar, AlertController} from 'ionic-angular';
import {LanguageService} from "../../services/language";
import {KhatmService} from "../../services/khatm.service";
import {StylingService} from "../../services/styling";

@IonicPage()
@Component({
  selector: 'page-commitment',
  templateUrl: 'commitment.html',
})
export class CommitmentPage implements OnInit{
  @ViewChild(Navbar) navBar: Navbar;
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
  anyPagesCommitted: boolean = false;
  allSelection: boolean = false;
  selectionCounter: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private ls: LanguageService, private khatmService: KhatmService,
              private stylingService: StylingService, private alertCtrl: AlertController) {}

  ngOnInit(){
    this.navBar.setBackButtonText(this.ls.translate('Back'));

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


    this.navBar.backButtonClick = (e:UIEvent) => {
      if(this.startRange !== null && this.endRange === null){
        //Submit startRange commitment
        this.khatmService.commitPages(this.khatm.khid, [this.startRange], this.startRange.isread);
      }

      if(this.anyPagesCommitted)
        this.alertCtrl.create({
          title: this.ls.translate('Commit Pages Confirmation'),
          message: this.ls.translate('All changes will be irreversible after you exit. Do you sure to exit?'),
          buttons: [
            {
              text: this.ls.translate('Yes'),
              handler: () => {
                this.navCtrl.pop();
              }
            },
            {
              text: this.ls.translate('No'),
              role: 'cancel'
            }
          ]
        }).present();
      else
        this.navCtrl.pop();
    }
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
    this.anyPagesCommitted = true;

    if(this.startRange !== null)
      this.selectRange(page);
    else {
      // this.allSelection = (page.isread && this.allSelection) ? false : this.allSelection;

      page.isread = !page.isread;
      this.khatm.you_read = (page.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
      this.khatm.you_unread = (page.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
      this.khatm.read_pages = (page.isread) ? parseInt(this.khatm.read_pages) + 1 : parseInt(this.khatm.read_pages) - 1;
      this.khatmService.commitPages(this.khatm.khid, [page], page.isread);
    }
  }

  selectRange(page){
    if(this.startRange === null) {
      if(page.isread) {
        this.startRange = null;
        this.commit(page);
      }
      else {
        page.isread = true;
        this.khatm.you_read = (page.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
        this.khatm.you_unread = (page.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
        this.khatm.read_pages = (page.isread) ? parseInt(this.khatm.read_pages) + 1 : parseInt(this.khatm.read_pages) - 1;
        this.startRange = page;
      }
    }
    else if(this.endRange === null)
      this.endRange = page;

    if(this.startRange !== null && this.endRange !== null){
      //check the position of start/end range (change the position if needed)
      if(this.startRange.page_number > this.endRange.page_number){
        let tmp = this.startRange;
        this.startRange = this.endRange;
        this.endRange = tmp;
        this.endRange.isread = false;
        this.startRange.isread = true;
      }
      else if(this.startRange.page_number === this.endRange.page_number){
        if(this.startRange.repeat_number > this.endRange.repeat_number){
          let tmp = this.startRange;
          this.startRange = this.endRange;
          this.endRange = tmp;
          this.endRange.isread = false;
          this.startRange.isread = true;
        }
      }

      let anyIsRead = false;

      //Check pages status
      this.allCommitments.forEach(el => {
        if((el.page_number > this.startRange.page_number ||
          (el.page_number === this.startRange.page_number && el.repeat_number > this.startRange.repeat_number)) &&
          (el.page_number < this.endRange.page_number ||
          (el.page_number === this.endRange.page_number && el.repeat_number <= this.endRange.repeat_number)))
            anyIsRead = anyIsRead || el.isread;
      });

      if(anyIsRead){
        let tempStartRange = this.startRange;
        tempStartRange.isread = false;
        this.startRange = null;
        this.commit(tempStartRange);
        this.commit(this.endRange);
        this.endRange = null;
        return;
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
            this.khatm.read_pages = (el.isread) ? parseInt(this.khatm.read_pages) + 1 : parseInt(this.khatm.read_pages) - 1;
            pages.push(el);
        }
      });

      let readPages = pages.filter(el => el.isread === true);
      let unreadPages = pages.filter(el => el.isread === false);

      this.khatmService.commitPages(this.khatm.khid, readPages, true)
          .then((res) => this.khatmService.commitPages(this.khatm.khid, unreadPages, false))
          .catch((err) => console.log(err));

      this.startRange = null;
      this.endRange = null;

      this.anyPagesCommitted = true;
    }
  }

  allSelectionChange(){
    let currentReadStatus = false;

    if(this.allSelection)
      currentReadStatus = false;
    else
      currentReadStatus = true;

    this.allCommitments.forEach(el => el.isread = currentReadStatus);
    this.allCommitments.forEach(el => this.commit(el));
  }
}
