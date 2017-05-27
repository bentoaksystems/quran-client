import {Component, Input, ViewChild} from '@angular/core';
import {QuranService} from "../../services/quran.service";
import {StylingService} from "../../services/styling";
import {Keyboard} from "ionic-angular";

/**
 * Generated class for the Hashia component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'hashia',
  templateUrl: 'hashia.html'
})
export class Hashia {
  @Input() suraname;
  private _so;
  private _pn;
  private pageNumberToggled=false;

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
    this.selectedPage=pn;
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

  constructor(private quranService: QuranService, private stylingService: StylingService, private keyboard: Keyboard) {
    for (let i = 1; i < 115; i++)
      this.suras.push({name: this.quranService.getSura(i).name, number: i, numberAr: i.toLocaleString(('ar'))});
    for (let i = 1; i < 31; i++)
      this.juzes.push({number: i, numberAr: i.toLocaleString(('ar'))});
    for (let i = 1; i < 605; i++)
      this.pages.push({number: i, numberAr: i.toLocaleString(('ar'))});
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

  changeSura() {
    this.quranService.goTo('sura', this.selectedSura);
  }

  changeJuz() {
    this.quranService.goTo('juz', this.selectedJuz);
  }

  changePage() {
    this.quranService.goTo('page', this.selectedPage);
  }
  keyup(e){
    if(e.keyCode===13){
      this.pageNumberToggled=false;
      this.changePage();
    }
  }
  pageNumberToggle(val=null) {
    if(this.pageNumberToggled!==val) {
      this.pageNumberToggled = !this.pageNumberToggled;
      if (!this.pageNumberToggled) {
        this.changePage();
        this.keyboard.close();
      }
    }
  }
}
