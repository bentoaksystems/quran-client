import {Component, Input, OnInit} from '@angular/core';
import {Component, Input, OnInit, ViewChild, AfterViewChecked} from '@angular/core';
import {QuranService} from "../../services/quran.service";
import {StylingService} from "../../services/styling";
import {Keyboard, NavParams, PopoverController} from "ionic-angular";
import {Keyboard} from "ionic-angular";
import {getTsFilePaths} from "@ionic/app-scripts/dist/upgrade-scripts/add-default-ngmodules";

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
  conditionalColoring: any = {
    background: 'normal_back',
    backgroundLighter: 'normal_back_secondary',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };

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

    this.stylingService.nightMode$.subscribe(
      (data) => {
        if(data) {
          this.conditionalColoring.background = 'night_back';
          this.conditionalColoring.backgroundLighter = 'night_back_secondary';
          this.conditionalColoring.text = 'night_text';
          this.conditionalColoring.primary = 'night_primary';
          this.conditionalColoring.secondary = 'night_secondary';
        }
        else{
          this.conditionalColoring.background = 'normal_back';
          this.conditionalColoring.backgroundLighter = 'normal_back_secondary';
          this.conditionalColoring.text = 'normal_text';
          this.conditionalColoring.primary = 'normal_primary';
          this.conditionalColoring.secondary = 'normal_secondary';
        }
      }
    );
  }

  changeSura(event) {
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

  changeJuz(event) {
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
    <ion-list>
      <button ion-item detail-none icon-start *ngFor="let sura of suras" (click)="changeSura(sura)"
              [color]="conditionalColoring.backgroundLighter"
              style="font-family: 'quran'; font-size: 1.2em; text-align: right;">
        <ion-label [color]="conditionalColoring.text">{{sura.numberAr}}. {{sura.name}}</ion-label>
        <ion-icon name="checkmark" *ngIf="selectedSura === sura.numberAr"></ion-icon>
      </button>
    </ion-list>
  `
})
export class SuraList implements OnInit{
  suras;
  disabled;
  selectedSura = 1;
  conditionalColoring: any = {
    background: 'normal_back',
    backgroundLighter: 'normal_back_secondary',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };

  constructor(private quranService: QuranService, private params: NavParams,
              private stylingService: StylingService){}

  ngOnInit(){
    this.suras = this.params.get('suras');
    this.disabled = this.params.get('disabled');

    this.stylingService.nightMode$.subscribe(
      (data) => {
        if(data) {
          this.conditionalColoring.background = 'night_back';
          this.conditionalColoring.backgroundLighter = 'night_back_secondary';
          this.conditionalColoring.text = 'night_text';
          this.conditionalColoring.primary = 'night_primary';
          this.conditionalColoring.secondary = 'night_secondary';
        }
        else{
          this.conditionalColoring.background = 'normal_back';
          this.conditionalColoring.backgroundLighter = 'normal_back_secondary';
          this.conditionalColoring.text = 'normal_text';
          this.conditionalColoring.primary = 'normal_primary';
          this.conditionalColoring.secondary = 'normal_secondary';
        }
      }
    );
  }

  changeSura(sura){
    console.log(sura);
    this.quranService.goTo('sura', sura.number);
  }
}

@Component({
  selector: 'juz-list',
  template: `
    <ion-list>
      <button ion-item detail-none icon-start *ngFor="let juz of juzes" (click)="changeJuz(juz)"
              [color]="conditionalColoring.backgroundLighter"
              style="font-family: 'quran'; font-size: 1.2em; text-align: right;">
        <ion-label [color]="conditionalColoring.text">جزء {{juz.numberAr}}</ion-label>
        <ion-icon name="checkmark" *ngIf="selectedJuz === juz.number"></ion-icon>
      </button>
    </ion-list>
  `
})
export class JuzList implements OnInit{
  juzes;
  disabled;
  selectedJuz = 1;
  conditionalColoring: any = {
    background: 'normal_back',
    backgroundLighter: 'normal_back_secondary',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };

  constructor(private quranService: QuranService, private params: NavParams,
              private stylingService: StylingService){}

  ngOnInit(){
    this.juzes = this.params.get('juzes');
    this.disabled = this.params.get('disabled');

    this.stylingService.nightMode$.subscribe(
      (data) => {
        if(data) {
          this.conditionalColoring.background = 'night_back';
          this.conditionalColoring.backgroundLighter = 'night_back_secondary';
          this.conditionalColoring.text = 'night_text';
          this.conditionalColoring.primary = 'night_primary';
          this.conditionalColoring.secondary = 'night_secondary';
        }
        else{
          this.conditionalColoring.background = 'normal_back';
          this.conditionalColoring.backgroundLighter = 'normal_back_secondary';
          this.conditionalColoring.text = 'normal_text';
          this.conditionalColoring.primary = 'normal_primary';
          this.conditionalColoring.secondary = 'normal_secondary';
        }
      }
    );
  }

  changeJuz(juz){
    this.quranService.goTo('juz', juz.number);
  }
}
