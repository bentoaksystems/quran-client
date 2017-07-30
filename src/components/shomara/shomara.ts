import {Component, Input, OnInit} from '@angular/core';

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
export class Shomara implements OnInit{
  private _an;
  ayanumberAr: string;
  private _ff = 'qalam';
  @Input()
  set ayanumber(x){
    this._an = x;
    this.ayanumberAr = x.toLocaleString(this.fontFamily==='qalam'?'fa':'ar');
  }
  get ayanumber(){
    return this._an;
  }
  @Input() reverse;
  @Input()
  set fontFamily(ff) {
    this._ff=ff;
    this.ayanumberAr = this.ayanumber.toLocaleString(this.fontFamily==='qalam'?'fa':'ar');
  }
  get fontFamily() {
    if(this._ff === null)
      return 'qalam';
    else
      return this._ff;
  }

  get needntBorder(){
    return this.fontFamily==='quran-uthmanic'||this.fontFamily==='me-quran';
  }

  ngOnInit(){
    if(this.fontFamily==='quran-uthmanic')
      this.ayanumberAr = this.ayanumberAr.split('').reverse().join('');
  }

  constructor() {
  }
}
