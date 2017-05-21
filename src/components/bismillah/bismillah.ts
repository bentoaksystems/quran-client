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
  @Input() sura:number;
  private  suraAyaNumber : number=0;
  private  suraTanzilLocation;
  private  suraArabicName;
  private imgflag;
  private nightMode=false;

  constructor(private quranService: QuranService) {
  }

  ngOnInit() {
    this.nightMode = this.quranService.nightMode;
    let suraStats = this.quranService.suraStats(this.sura);
    console.log(suraStats);
    this.suraAyaNumber = suraStats.ayas;
    this.suraTanzilLocation = suraStats.tanzilLocation;
    this.imgflag = this.suraTanzilLocation !== "Meccan" ? false : true;
    this.suraTanzilLocation = this.suraTanzilLocation !== "Meccan" ? 'مدنی' : 'مکی';
    this.suraArabicName = suraStats.name;

    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
        }
      );
  }

}
