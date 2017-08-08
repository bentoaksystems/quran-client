import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Content, Keyboard, NavParams, PopoverController, ViewController} from "ionic-angular";
import {Storage} from "@ionic/storage";

import {QuranService} from "../../services/quran.service";
import {StylingService} from "../../services/styling";


@Component({
  selector: 'hashia',
  templateUrl: 'hashia.html'
})
export class Hashia implements OnInit {
  @Input() suraname;
  @Input() disabled = false;
  private _so;
  private _pn;
  private pageNumberToggled = false;

  @Input()
  set suraorder(so) {
    this._so = so;
    this.suraorderAr = this.suraorder ? this.suraorder.toLocaleString('ar') : '';
  };

  get suraorder() {
    return this._so;
  }

  @Input()
  set pagenumber(pn) {
    this._pn = pn;
    this.selectedPage = pn;
    this.pagenumberAr = this.pagenumber ? this.pagenumber.toLocaleString('ar') : '';
    this.pageJuzNumber = this.quranService.pageJuzCheck(this.pagenumber);
    this.pageJuzNumberAr = this.pageJuzNumber ? this.pageJuzNumber.toLocaleString('ar') : '';
  }

  get pagenumber() {
    return this._pn;
  }

  private pageJuzNumber: number;
  private nightMode;
  private suraorderAr;
  private pageJuzNumberAr;
  private pagenumberAr;
  private suras = [];
  private juzes = [];
  private pages = [];
  selectedSura = 1;
  selectedJuz = 1;
  selectedPage = 1;

  constructor(private quranService: QuranService, private stylingService: StylingService, private keyboard: Keyboard,
              private popoverCtrl: PopoverController) {
    this.suras = quranService.getAllSura();

    for (let i = 1; i < 31; i++)
      this.juzes.push({number: i, numberAr: i.toLocaleString('ar')});
    for (let i = 1; i < 605; i++)
      this.pages.push({number: i, numberAr: i.toLocaleString('ar')});
  }

  ngOnInit() {
    this.nightMode = this.stylingService.nightMode;

    this.stylingService.nightMode$
      .subscribe(
        (m) => {
          this.nightMode = m;
        }
      );
  }

  changeSura(event) {
    if(!this.disabled){
      let suraPopOver = this.popoverCtrl.create(SuraList, {
        suras: this.suras,
        disabled: this.disabled
      },{
        cssClass: (this.stylingService.nightMode) ? 'night_mode' : 'day_mode'
      });
      suraPopOver.present({
        ev: event
      });
    }
  }

  changeJuz(event) {
    if(!this.disabled){
      let juzPopOver = this.popoverCtrl.create(JuzList, {
        juzes: this.juzes,
        disabled: this.disabled
      },{
        cssClass: (this.stylingService.nightMode) ? 'night_mode' : 'day_mode'
      });
      juzPopOver.present({
        ev: event
      });
    }
  }

  changePage() {
    this.quranService.goTo('page', +this.selectedPage);
  }

  keyup(e) {
    if (e.keyCode === 13) {
      this.pageNumberToggled = false;
      this.changePage();
      setTimeout(() => this.keyboard.close(), 100);
    }
  }

  pageNumberToggle(val = null) {
    if (!this.disabled && this.pageNumberToggled !== val) {
      this.pageNumberToggled = !this.pageNumberToggled;
      if (!this.pageNumberToggled) {
        this.changePage();
        this.keyboard.close();
      }
    }
  }
}


@Component({
  selector: 'sura-list',
  template: `
    <ion-content #content>
      <ion-list>
        <button ion-item detail-none icon-start [id]="'item' + sura.number" *ngFor="let sura of suras" (click)="changeSura(sura)"
                [color]="stylingService.conditionalColoring.backgroundLighter"
                style="font-family: 'quran'; font-size: 1.2em; text-align: right;">
          {{sura.numberAr}}. {{sura.name}}
          <ion-icon name="checkmark" *ngIf="selectedSura === sura.number"></ion-icon>
        </button>
      </ion-list>
    </ion-content>
  `
})
export class SuraList implements OnInit{
  @ViewChild('content') content: Content;
  suras;
  disabled;
  selectedSura = 1;

  constructor(private quranService: QuranService, private params: NavParams,
              private stylingService: StylingService, private storage: Storage,
              private viewCtrl: ViewController){}

  ngOnInit(){
    this.storage.get('selected_sura')
      .then(res => {
        this.selectedSura = (res) ? res : 1;
        this.scrollToItem(this.selectedSura);
      })
      .catch(err => this.selectedSura = 1);

    this.suras = this.params.get('suras');
    this.disabled = this.params.get('disabled');
  }

  scrollToItem(itemNumber){
    let yOffset = document.getElementById('item' + itemNumber).offsetTop;
    this.content.scrollTo(0, yOffset);
  }

  changeSura(sura){
    this.selectedSura = sura.number;
    this.storage.set('selected_sura', this.selectedSura);
    this.quranService.goTo('sura', sura.number);
    this.viewCtrl.dismiss();
  }
}

@Component({
  selector: 'juz-list',
  template: `
    <ion-list>
      <button ion-item detail-none icon-start id="item{{juz.number}}" *ngFor="let juz of juzes" (click)="changeJuz(juz)"
              [color]="stylingService.conditionalColoring.backgroundLighter"
              style="font-family: 'quran'; font-size: 1.2em; text-align: right;">
        جزء {{juz.numberAr}}
        <ion-icon name="checkmark" *ngIf="juz.number === selectedJuz"></ion-icon>
      </button>
    </ion-list>
  `
})
export class JuzList implements OnInit{
  juzes;
  disabled;
  selectedJuz = 1;

  constructor(private quranService: QuranService, private params: NavParams,
              private stylingService: StylingService, private storage: Storage,
              private viewCtrl: ViewController){}

  ngOnInit(){
    this.storage.get('selected_juz')
      .then(res => this.selectedJuz = (res) ? res : 1)
      .catch(err => this.selectedJuz = 1);

    this.juzes = this.params.get('juzes');
    this.disabled = this.params.get('disabled');
  }

  changeJuz(juz){
    this.selectedJuz = juz.number;
    this.storage.set('selected_juz', this.selectedJuz);
    this.quranService.goTo('juz', juz.number);
    this.viewCtrl.dismiss();
  }
}
