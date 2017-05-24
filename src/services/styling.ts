import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

const FONT_PARAMS = {
  quran:                  [.8131, 130, false ],
  "quran-uthmanic":       [46/67, 150, true ],
  "quran-uthmanic-bold":  [37/50, 160, true],
  "qalam":                [34/50, 155, true],
  "me-quran":             [30/54, 185, true]
}

@Injectable()
export class StylingService {
  private zoomChangeStream = new Subject<number>();
  private nightModeStream = new Subject<boolean>();
  private fontChangeStream = new Subject<number>();

  zoomChanged$ = this.zoomChangeStream.asObservable();
  nightMode$ = this.nightModeStream.asObservable();
  curZoom = 0;
  nightMode= false;
  fontChanged$ = this.fontChangeStream.asObservable();
  font = 0;

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

  nightModeSwitch() {
    this.nightMode = !this.nightMode;
    this.nightModeStream.next(this.nightMode);
  }
}
