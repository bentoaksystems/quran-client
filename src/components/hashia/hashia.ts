import {Component, Input} from '@angular/core';
import {QuranService} from "../../services/quran.service";

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
  @Input()
  set suraorder(so) {
    this._so = so;
    this.suraorderAr = this.suraorder?this.suraorder.toLocaleString('ar'):'';
  };
  get suraorder() {
    return this._so;
  }

  @Input()
  set pagenumber(pn) {
    this._pn = pn;
    this.pagenumberAr = this.pagenumber?this.pagenumber.toLocaleString('ar'):'';
  }
  get pagenumber(){
    return this._pn;
  }

  private  pageJuzNumber: number;
  private  nightMode;
  private suraorderAr;
  private pageJuzNumberAr;
  private pagenumberAr;

  constructor(private quranService: QuranService) {
  }
  ngOnInit() {
    this.nightMode = this.quranService.nightMode;
    this.suraname='';


    this.suraname +=' ';
    this.suraname.trim();
    this.pageJuzNumber = this.quranService.pageJuzCheck(this.pagenumber);
    this.pageJuzNumberAr = this.pageJuzNumber?this.pageJuzNumber.toLocaleString('ar'):'';



    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
        }
      );


  }
}
