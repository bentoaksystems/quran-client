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
  isMember: boolean = true;

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
    this.isMember = this.navParams.get('isMember') === undefined ? true : this.navParams.get('isMember');

    this.rowPages = [];
    if(this.isSelect){
      this.khatmService.getFreePages(this.khatm.khid)
        .then(res => {
          this.allCommitments = this.sortPages(res.json());
          this.allCommitments.forEach(el => {
            if(el.uid !== null){
              el.isread = true;
              this.selectionCounter++;
            }
          });
          this.createRows();
          waiting_loading.dismiss();
        })
        .catch(err => {
          console.log(err);
          waiting_loading.dismiss();
        })
    }
    else{
      this.khatmService.getKhatmPages(this.khatm.khid)
        .then((value) => {
          this.allCommitments = this.sortPages(value);
          this.createRows();
          waiting_loading.dismiss();
        })
        .catch((err) => {
          console.log(err);
          waiting_loading.dismiss();
        });
    }

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

  clickPage(page){
    if(this.isSelect)
      this.assignPage(page);
    else
      this.commit(page);
  }

  pressPage(page){
    if(this.isSelect)
      this.assignRange(page);
    else
      this.selectRange(page);
  }

  assignPage(page){
    if(this.startRange !== null)
      this.assignRange(page);
    else{
      page.isread = !page.isread;
      let unread_pages = this.khatm.you_unread === null ? 0 : parseInt(this.khatm.you_unread);

      this.khatm.you_unread = (page.isread) ? unread_pages + 1 : unread_pages - 1;
      this.khatmService.selfAssignPage(this.khatm.khid, [page.cid], page.isread, this.isMember)
        .then(res => {
          if(res.length === 1)
            this.msgService.showMessage('inform', this.ls.translate('Page') + ' ' + page.page_number + ' ' + this.ls.translate('marked as ') + ' ' +  this.ls.translate((page.isread ? 'assigned' : 'unassigned')));
          else{
            this.msgService.showMessage('warn', this.ls.translate('Cannot assign you page') + ' ' + page.page_nubmer + '.' + this.ls.translate('Choose another page.'), true);
          }

          this.selectionCounter = (page.isread) ? this.selectionCounter + 1 : this.selectionCounter - 1;
          this.vibration.vibrate(100);
        })
        .catch(err => {
          page.isread = !page.isread;
          this.msgService.showMessage('error', 'Cannot save your changes. Please try again.', true);
        });

      this.checkAllSelection();
    }
  }

  assignRange(page){
    let unread_pages = this.khatm.you_unread === null ? 0 : parseInt(this.khatm.you_unread);

    if(this.startRange === null){
      page.isread = !page.isread;
      this.khatm.you_unread = (page.isread) ? unread_pages + 1 : unread_pages - 1;
      this.startRange = page;

      this.selectionCounter = (page.isread) ?  this.selectionCounter + 1 : this.selectionCounter - 1;
    }
    else if(this.endRange === null)
      this.endRange = page;

    if(this.startRange !== null && this.endRange !== null){
      //Check the position of start/end range (Change the position if needed)
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
          this.khatm.you_unread = (el.isread) ? unread_pages + 1 : unread_pages - 1;
          pages.push(el);
        }
      });

      let targetPages_cids = pages.filter(el => el.isread === this.startRange.isread).map(el => el.cid);

      this.khatmService.selfAssignPage(this.khatm.khid, targetPages_cids, this.startRange.isread, this.isMember)
        .then(res => {
          this.vibration.vibrate(100);

          if(res.json().length > targetPages_cids.length)
            this.msgService.showMessage('inform', this.ls.translate('Pages from') + ' ' +
                                        this.startRange.page_number + ' ' +
                                        this.ls.translate('to') + ' ' +
                                        this.ls.translate('marked as') + ' ' +
                                        this.ls.translate(this.startRange.isread ? 'assigned' : 'unassigned'));
          else{
            let notAssignPages = [];

            targetPages_cids.forEach(el => {
              if(!res.includes(el)){
                notAssignPages.push(targetPages_cids);
                pages.find(i => i.cid === el).isread = !pages.find(i => i.cid === el).isread;
              }
            });

            this.msgService.showMessage('warn', this.ls.translate('Cannot assign you below pages:' + notAssignPages.join(',') + '\n' + 'choose another pages.'))
          }
        })
        .catch(err => {
          this.msgService.showMessage('error', 'Cannot save your changes. Please try again.', true);
        });

      this.startRange = null;
      this.endRange = null;

      this.checkAllSelection();
    }
  }

  commit(page){
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
    if(!this.isSelect){
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

      if(needChange.length > 0)
        this.anyPagesCommitted = true;

      needChange.forEach(page => {
        page.isread = !page.isread;
        this.khatm.you_read = (page.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
        this.khatm.you_unread = (page.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
        this.khatm.read_pages = (page.isread) ? parseInt(this.khatm.read_pages) + 1 : parseInt(this.khatm.read_pages) - 1;

        this.selectionCounter = (page.isread) ? this.selectionCounter + 1 : this.selectionCounter - 1;
      });

      //Send need change pages to server
      this.khatmService.commitPages(this.khatm.khid, needChange, !currentReadStatus);

      this.vibration.vibrate(100);
      this.checkAllSelection();
    }
    else{
      this.allSelection = false;
      this.msgService.showMessage('warn', this.ls.translate('Cannot select all pages in this mode'));
    }
  }

  checkAllSelection(){
    let all_isread: boolean = true;

    this.allCommitments.forEach(el => all_isread = all_isread && el.isread);

    this.allSelection = all_isread;
  }

  sortPages(list){
    return list.sort((a, b) => {
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
  }
}
