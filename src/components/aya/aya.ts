import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {QuranService} from "../../services/quran.service";
import {MsgService} from "../../services/msg.service";
import {LanguageService} from "../../services/language";

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
export class Aya implements AfterViewInit {
  @Input() value;
  @Input() fontFamily;
  @Input() margin;
  @ViewChild('bism') bism;
  @Output() onselect = new EventEmitter<any>();
  private _selected: boolean = false;
  @Input()
  get selected() {
    return this._selected;
  }

  set selected(s) {
    this._selected = s;
  }

  constructor(private quranService: QuranService, private msg: MsgService, private l: LanguageService) {
  }

  ngAfterViewInit(): void {
    if (this.value.bismillah)
      this.quranService.suraTop(this.value.sura, this.bism.nativeElement.offsetTop + this.bism.nativeElement.offsetHeight);
  }

  sajdaCheck(obj) {
    var ind = this.quranService.sajdaCheck(obj);
    var type;
    if (ind === -1)
      type = false;
    else if (ind < 11)
      type = 'recommended';
    else
      type = 'obligatory';

    return type;
  }

  sectionCheck(obj): any {
    var ind = this.quranService.qhizbCheck(obj);
    var type;
    if (ind === -1)
      type = false;
    switch (ind % 8) {
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

  hizbJuzNumberCheck(obj): any {
    var qhizbInd = this.quranService.qhizbCheck(obj);
    return {qhizbNum: qhizbInd}
  }

  selectAya() {
    if (!this.selected) {
      this.selected = true;
      this.onselect.next({aya:this.value,selected:true});
      let trans = this.l.qt[this.value.sura + '_' + this.value.aya];
      if (trans) {
        this.msg.showMessage('inform', trans, true, () => {
          this._selected = false;
          this.onselect.next({aya:this.value,selected:false})
        });
      }
    }
  }
}
