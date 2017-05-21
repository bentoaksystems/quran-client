import {Component, Input} from '@angular/core';
import {QuranService} from "../../services/quran.service";

/**
 * Generated class for the Bismillah component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'bismillah',
  templateUrl: 'bismillah.html'
})
export class Bismillah {

  @Input() bismillahText = '';
  @Input() suraname = '';
  private  suraAyaNumber : number=0;
  private  suraTanzilLocation;
  private  suraArabicName;
  private imgflag;
  private nightMode=false;

  constructor(private quranService: QuranServiice) {
  }

  ngOnInit() {
    this.nightMode = this.quranService.nightMode;
    this.suraAyaNumber = this.quranService.suraAyaNumberCheck(this.suraname,false).a;
    this.suraTanzilLocation = this.quranService.suraAyaNumberCheck(this.suraname,true).b;
    this.imgflag = (this.suraTanzilLocation > "Meccan" ? false : true );
    this.suraTanzilLocation = (this.suraTanzilLocation > "Meccan" ? 'مدنی' : 'مکی' );
    this.suraArabicName = this.quranService.suraAyaNumberCheck(this.suraname,true).c;

    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
        }
      );
  }

}
