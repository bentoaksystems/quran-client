import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Navbar, AlertController, LoadingController} from 'ionic-angular';
import {LanguageService} from "../../services/language";
import {KhatmService} from "../../services/khatm.service";
import {StylingService} from "../../services/styling";
import {MsgService} from "../../services/msg.service";
import {Vibration} from "@ionic-native/vibration";

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
  anyPagesCommitted: boolean = false;
  allSelection: boolean = false;
  selectionCounter: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private ls: LanguageService, private khatmService: KhatmService,
              private stylingService: StylingService, private alertCtrl: AlertController,
              private msgService: MsgService, private vibration: Vibration,
              private loadingCtrl: LoadingController) {}

  ngOnInit(){
    this.navBar.setBackButtonText(this.ls.translate('Back'));

    //Create loading
    let waiting_loading = this.loadingCtrl.create({
      content: this.ls.translate('Please wait until your committed pages are loaded ...'),
      cssClass: ((this.stylingService.nightMode) ? 'night_mode' : 'day_mode') + ' waiting'
    });

    waiting_loading.present();

    //Style back button
    if(this.ls.direction() === 'rtl')
      this.navBar.setElementClass('persian', true);
    else
      this.navBar.setElementClass('persian', false);

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
        waiting_loading.dismiss();
      })
      .catch((err) => {
        console.log(err);
        waiting_loading.dismiss();
      });


    this.navBar.backButtonClick = (e:UIEvent) => {
      if(this.startRange !== null && this.endRange === null){
        //Submit startRange commitment
        this.khatmService.commitPages(this.khatm.khid, [this.startRange], this.startRange.isread);
      }

      if(this.anyPagesCommitted)
        this.alertCtrl.create({
          title: this.ls.translate('Confirm committed pages'),
          message: this.ls.translate("Changes will be irreversible after exit, are you sure?"),
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
          ],
          cssClass: (this.stylingService.nightMode) ? 'night_mode' : 'day_mode'
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

  commit(page, fromAll: boolean = false){
    this.anyPagesCommitted = true;

    if(this.startRange !== null)
      this.selectRange(page);
    else {
      page.isread = !page.isread;
      this.khatm.you_read = (page.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
      this.khatm.you_unread = (page.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
      this.khatm.read_pages = (page.isread) ? parseInt(this.khatm.read_pages) + 1 : parseInt(this.khatm.read_pages) - 1;
      this.khatmService.commitPages(this.khatm.khid, [page], page.isread);

      this.selectionCounter = (page.isread) ? this.selectionCounter + 1 : this.selectionCounter - 1;

      if(!fromAll)
        this.msgService.showMessage('inform', this.ls.translate('Page') + ' ' + page.page_number + ' ' + this.ls.translate('marked as') + ' ' + this.ls.translate((page.isread ? 'read' : 'unread')));

      this.vibration.vibrate(100);
      this.checkAllSelection();
    }
  }

  selectRange(page){
    if (this.startRange === null) {
      page.isread = !page.isread;
      this.khatm.you_read = (page.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
      this.khatm.you_unread = (page.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
      this.khatm.read_pages = (page.isread) ? parseInt(this.khatm.read_pages) + 1 : parseInt(this.khatm.read_pages) - 1;
      this.startRange = page;

      this.selectionCounter = (page.isread) ? this.selectionCounter + 1 : this.selectionCounter - 1;
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

      let pages = [];
      pages.push(this.startRange);

      this.allCommitments.forEach(el => {
        if((el.page_number > this.startRange.page_number ||
           (el.page_number === this.startRange.page_number && el.repeat_number > this.startRange.repeat_number)) &&
           (el.page_number < this.endRange.page_number ||
           (el.page_number === this.endRange.page_number && el.repeat_number <= this.endRange.repeat_number))){
            if(el.isread !== this.startRange.isread)
              this.selectionCounter = (el.isread) ? this.selectionCounter - 1 : this.selectionCounter + 1;

            el.isread = this.startRange.isread;
            this.khatm.you_read = (el.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
            this.khatm.you_unread = (el.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
            this.khatm.read_pages = (el.isread) ? parseInt(this.khatm.read_pages) + 1 : parseInt(this.khatm.read_pages) - 1;
            pages.push(el);
        }
      });

      let targetPages = pages.filter(el => el.isread === this.startRange.isread);

      this.khatmService.commitPages(this.khatm.khid, targetPages, this.startRange.isread)
          .then((res) => {
            this.vibration.vibrate(100);
            this.msgService.showMessage('inform', this.ls.translate('Pages from') + ' ' +
                                        this.startRange.page_number + ' ' +
                                        this.ls.translate('to') + ' ' +
                                        this.ls.translate('marked as') + ' ' +
                                        this.ls.translate(this.startRange.isread ? 'read' : 'unread'));
          })
          .catch((err) => {
            this.msgService.showMessage('error', 'Cannot save your changes. Please try again.', true);
          });

      this.startRange = null;
      this.endRange = null;

      this.anyPagesCommitted = true;

      this.checkAllSelection();
    }
  }

  allSelectionChange(){
    let currentReadStatus = false;

    if(this.allSelection) {
      currentReadStatus = false;
      this.msgService.showMessage('inform', this.ls.translate('All pages marked as read'));
    }
    else {
      currentReadStatus = true;
      this.msgService.showMessage('inform', this.ls.translate('All pages marked as unread'));
    }

    let needChange = this.allCommitments.filter(el => el.isread === currentReadStatus);
    needChange.forEach(el => this.commit(el, true));
  }

  checkAllSelection(){
    let all_isread: boolean = true;

    this.allCommitments.forEach(el => all_isread = all_isread && el.isread);

    this.allSelection = all_isread;
  }
}
