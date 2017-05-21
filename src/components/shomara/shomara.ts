import {Component, Input} from '@angular/core';

/**
 * Generated class for the Shomara component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'shomara',
  templateUrl: 'shomara.html'
})
export class Shomara {
  private _an;
  ayanumberAr: string;
  @Input()
  set ayanumber(x){
    this._an = x;
    this.ayanumberAr = x.toLocaleString(this.farsiNums?'fa':'ar');
  }
  get ayanumber(){
    return this._an;
  }
  @Input() reverse;
  @Input() fontFamily;

  get needntBorder(){
    return this.fontFamily==='quran-uthmanic'||this.fontFamily==='me-quran';
  };

  get farsiNums(){
    return this.fontFamily==='qalam';
  }

  constructor() {
  }
}
