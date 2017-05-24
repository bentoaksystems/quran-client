import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/throttleTime';
import {QURAN_DATA, QuranData, QuranReference, QuranSections, QuranSection} from './quran-data';
import { Subject } from "rxjs/Subject";

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
  private ayaStream = new Subject<QuranReference>();
  private pageStream = new Subject<number>();
  private quranData:QuranData = QURAN_DATA;
  aya$ = this.ayaStream.asObservable();
  page$ = this.pageStream.asObservable().throttleTime(500);

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

  sajdaCheck(obj){
    var ind = this.quranData.sajda.findIndex(qs=>qs.loc.aya===obj.aya&&qs.loc.sura===obj.sura);
    return ind;
  }

  qhizbCheck(obj){
    var ind = this.quranData.qhizb.findIndex(qs=>qs.aya===obj.aya&&qs.sura===obj.sura);
    return ind;
  }

  pageForSection(sectionType,sectionNumber){
    var s;
    if(sectionType === 'page')
      s = sectionNumber;
    else if(sectionType==='sura')
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
    return this.quranData.endJuzPage.findIndex(a=> a >= number)+1;
  }

  suraStats(sura:number) {
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
    if(section.start) {
      let startIndex = ayas.findIndex(a=>a.sura === section.start.sura && a.aya === section.start.aya);
      let endIndex = section.end? ayas.findIndex(a=>a.sura === section.end.sura && a.aya === section.end.aya): ayas.length -1;
      if (section.start.aya === 1 && section.start.sura !== 1) {
        startIndex--;
      }
      if (section.end && section.end.aya === 1) {
        endIndex--;
      }

      let ret = ayas.slice(startIndex, endIndex);
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
