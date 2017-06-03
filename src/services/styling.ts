import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";
import {Storage} from "@ionic/storage";

@Injectable()
export class StylingService {
  constructor(private storage: Storage){
    ['curZoom','nightMode','fontFamily'].forEach(key=>{
       this.storage.get(key)
         .then(val=>{
           this[key] = val;
           if(val!==undefined && val!==null)
             this[key+'Stream'].next(key==='fontFamily'?NaN:val)
         })
         .catch(err=>console.log(err));
    })
  }
  curZoom = 0;
  nightMode= false;
  font = 0;
  private curZoomStream = new ReplaySubject<number>(1);
  private nightModeStream = new ReplaySubject<boolean>(1);
  private fontFamilyStream = new ReplaySubject<number>(1);

  zoomChanged$ = this.curZoomStream.asObservable();
  nightMode$ = this.nightModeStream.asObservable();
  fontChanged$ = this.fontFamilyStream.asObservable();
  fontFamily='quran';

  zoomIn(){
    this.curZoom++;
    this.curZoomStream.next(this.curZoom);
    this.storage.set('curZoom',this.curZoom);
    return this.curZoom;
  }
  zoomOut(){
    this.curZoom--;
    this.curZoomStream.next(this.curZoom);
    this.storage.set('curZoom',this.curZoom);
    return this.curZoom;
  }
  resetZoom(){
    this.curZoom=0;
    this.curZoomStream.next(0);
    this.storage.set('curZoom',this.curZoom);
    return this.curZoom;
  }
  fontChange(){
    this.font++;
    this.fontFamilyStream.next(this.font);
    setTimeout(()=>this.storage.set('fontFamily',this.fontFamily),1000);
  }

  nightModeSwitch() {
    this.nightMode = !this.nightMode;
    this.nightModeStream.next(this.nightMode);
    this.storage.set('nightMode',this.nightMode);
  }
}
