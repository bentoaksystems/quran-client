import {Component, Input} from '@angular/core';
import {QuranService} from "../../services/quran.service";
import {StylingService} from "../../services/styling";

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
  @Input() margin;
  @Input() bismillahText = '';
  @Input() value;
  private  suraAyaNumber : number=0;
  private  suraTanzilLocation;
  private  suraArabicName;
  private imgflag;
  private nightMode=false;

  constructor(private quranService: QuranService, private stylingService:StylingService) {
  }

  ngOnInit() {
    this.nightMode = this.stylingService.nightMode;
    let suraStats = this.quranService.suraStats(this.value.sura);
    this.suraAyaNumber = suraStats.ayas;
    this.suraTanzilLocation = suraStats.tanzilLocation;
    this.imgflag = this.suraTanzilLocation !== "Meccan" ? false : true;
    this.suraTanzilLocation = this.suraTanzilLocation !== "Meccan" ? 'مدنية' : 'مکية';
    this.suraArabicName = suraStats.name;

    this.stylingService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
        }
      );
  }

}
