import {Component, Input} from '@angular/core';
import {QuranService} from "../../services/quran.service";

/**
 * Generated class for the Aya component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'aya',
  templateUrl: 'aya.html'
})
export class Aya {
  @Input() value;

  constructor(private quranService:QuranService) {
  }

  sajdaCheck(obj){
    var ind = this.quranService.sajdaCheck(obj);
    var type;
    if(ind === -1)
      type = false;
    else if(ind < 11)
      type = 'recommended';
    else
      type = 'obligatory';

    return type;
  }

  sectionCheck(obj):any{
    var ind = this.quranService.qhizbCheck(obj);
    var type;
    if(ind===-1)
      type = false;
    switch(ind % 8){
      case 0:
        type = 'juz';
        break;
      case 1:
      case 5:
        type = 'qhizb';
        break;
      case 2:
      case 6:
        type = 'hhizb';
        break;
      case 3:
      case 7:
        type = '3qhizb';
        break;
      case 4:
        type = 'hizb';
        break;
    }
    return type;
  }

  hizbJuzNumberCheck(obj):any{
    var qhizbInd = this.quranService.qhizbCheck(obj);
    return {qhizbNum : qhizbInd}
  }
}
