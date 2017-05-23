import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/throttleTime';
import {QURAN_DATA, QuranData, QuranReference, QuranSections, QuranSection} from './quran-data';
import { Subject } from "rxjs/Subject";

const FONT_PARAMS = {
  quran:                  [.8131, 130, false ],
  "quran-uthmanic":       [46/67, 150, true ],
  "quran-uthmanic-bold":  [37/50, 160, true],
  "qalam":                [34/50, 155, true],
  "me-quran":             [30/54, 185, true]
}

export class SectionAddress{
  num:number;
  text:any;
  constructor(obj:any){
    this.num = obj.num;
    this.text = obj.text?obj.text:null;
  }
}

@Injectable()
export class QuranService {
  private contentChangeStream = new Subject<number>();
  private zoomChangeStream = new Subject<number>();
  private nightModeStream = new Subject<boolean>();
  private ayaStream = new Subject<QuranReference>();
  private pageStream = new Subject<number>();
  private fontChangeStream = new Subject<number>();
  private quranData:QuranData = QURAN_DATA;
  contentChanged$ = this.contentChangeStream.asObservable();
  zoomChanged$ = this.zoomChangeStream.asObservable();
  nightMode$ = this.nightModeStream.asObservable();
  aya$ = this.ayaStream.asObservable();
  page$ = this.pageStream.asObservable().throttleTime(500);
  curZoom = 0;
  nightMode= false;
  fontChanged$ = this.fontChangeStream.asObservable();
  font = 0;
  def = 0;
  temp = '';
  i = 0;

  constructor(private http:Http) { }

  getQuran(){
    return this.http.request('assets/quran-simple-enhanced.json')
      .map(res => res.json().data);
  }

  getPage(pageNum){
    var page = this.getSec('page',pageNum);
    return page;
  }

  applySectionFilter(sectionType, ayas, index){
    return this.filterFunc(sectionType, ayas, index);
  }

  getRukus(rukuNum){
    var ruku = this.getSec('ruku', rukuNum);
    return ruku;
  }

  getSura(suraNum){
    return this.quranData.suras[suraNum-1];
  }
  contentChange(layer){
    this.contentChangeStream.next(layer);
  }
  zoomIn(){
    this.curZoom++;
    this.zoomChangeStream.next(this.curZoom);
    return this.curZoom;
  }
  zoomOut(){
    this.curZoom--;
    this.zoomChangeStream.next(this.curZoom);
    return this.curZoom;
  }
  resetZoom(){
    this.curZoom=0;
    this.zoomChangeStream.next(0);
    return this.curZoom;
  }
  fontChange(){
    this.font++;
    this.fontChangeStream.next(this.font);
  }
  fontParams(fontFamily){
    return FONT_PARAMS[fontFamily]
  }
  sajdaCheck(obj){
    var ind = this.quranData.sajda.findIndex(qs=>qs.loc.aya===obj.aya&&qs.loc.sura===obj.sura);
    return ind;
  }
  nightModeSwitch() {
    this.nightMode = !this.nightMode;
    this.nightModeStream.next(this.nightMode);
  }
  qhizbCheck(obj){
    var ind = this.quranData.qhizb.findIndex(qs=>qs.aya===obj.aya&&qs.sura===obj.sura);
    return ind;
  }



  pageForSection(sectionType,sectionNumber){
    var s;
    if(sectionType==='sura')
      s = new QuranReference({sura:sectionNumber,aya:1});
    else {
      s = this.getSec(sectionType, sectionNumber);
      if (s.start)
        s = s.start;
      else
        return this.quranData.page.length-1;
    }
    return this.sectionForAya('page',s).num;
  }
  sectionForAya(sectionType,aya:QuranReference):SectionAddress{
    if(sectionType==='sura')
      return new SectionAddress({num:aya.sura, text: this.quranData.suras[aya.sura-1].name});
    else
      return new SectionAddress({num:this.quranData[sectionType].findReference(aya)});
  }

  goForth(sectionType,sectionNumber){
    var p = this.pageForSection(sectionType,sectionNumber);
    if(p<605)
      this.pageStream.next(p);
    else
      this.pageStream.next(1);
  }
  goBack(sectionType,sectionNumber){
    var p = this.pageForSection(sectionType,sectionNumber);
    if(p>0)
      this.pageStream.next(p);
    else
      this.pageStream.next(604);
  }
   goTo(sectionType,sectionNumber){
     this.temp = '';
    var p = this.pageForSection(sectionType,sectionNumber);
    if(p>604)
     this.pageStream.next(1);
    else if(p<1)
     this.pageStream.next(604);
    else
      this.pageStream.next(p);
  }

  suraNumberCheck(str){
    var ind = this.quranData.suras.findIndex(qs=>qs.name===str);
    if(ind!== -1)
     return ind+1;
  }
  pageJuzCheck(number){
    return this.quranData.endJuzPage.findIndex(a=>a>= number)+1;
  }

  suraStats(sura:number) {
    let name, tanzilLocation, ayaCount;

    return this.quranData.suras[sura - 1];
  }
  changeCurAya(aya:QuranReference){
    this.ayaStream.next(aya);
  }

  getSec(secType:string,index:number):QuranSection{
    let ret = new QuranSection();
    if(index<=this.quranData[secType].length){
      ret.start = this.quranData[secType][index-1];
    }
    if(index<this.quranData[secType].length){
      ret.end = this.quranData[secType][index];
    }
    return ret;
  }
  filterFunc(secType:string,ayas, index){
    let section = this.getSec(secType, index);
    if(section.start && section.end) {
      let startIndex = ayas.findIndex(a=>a.sura === section.start.sura && a.aya === section.start.aya);
      let endIndex = ayas.findIndex(a=>a.sura === section.end.sura && a.aya === section.end.aya);
      if (section.start.aya === 1 && section.start.sura !== 1) {
        startIndex--;
      }
      if (section.end.aya === 1) {
        endIndex--;
      }
      let ret = ayas.slice(startIndex, endIndex);
      if(section.start.substrIndex){
        ret[0] = ret[0].substring(section.start.substrIndex);
      }

      if(section.end.substrIndex){
        ret[ret.length-1]
      }
      return ret;
    }
    else
      return([]);
  }
  findReference(secType:string,ref:QuranReference):number{
    let ret = this.quranData[secType].findIndex(el=>el.sura>ref.sura||(el.sura===ref.sura&&el.aya>ref.aya));
    return ret===-1?this.quranData[secType].length:ret;
  }

}
