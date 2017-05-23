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
  private _ff;
  @Input()
  set ayanumber(x){
    this._an = x;
    this.ayanumberAr = x.toLocaleString(this.farsiNums?'fa':'ar');
  }
  get ayanumber(){
    return this._an;
  }
  @Input() reverse;
  @Input()
  set fontFamily(ff) {
    this._ff=ff;
  }
  get fontFamily() {
    return this._ff;
  }

  get needntBorder(){
    return this.fontFamily==='quran-uthmanic'||this.fontFamily==='me-quran';
  }

  get farsiNums(){
    return this.fontFamily==='qalam';
  }

  ngOnInit(){
    if(this.fontFamily==='quran-uthmanic')
      this.ayanumberAr = this.ayanumberAr.split('').reverse().join('');
  }

  constructor() {
  }
}
