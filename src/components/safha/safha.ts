import {Component, OnInit, ViewChild, ViewChildren, AfterViewInit, QueryList} from '@angular/core';
import {QuranService} from "../../services/quran.service";
import {Platform, ToastController} from "ionic-angular";
import {Response} from "@angular/http";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {StylingService} from "../../services/styling";
import {Gesture} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
const fonts = ['quran', 'quran-uthmanic', 'quran-uthmanic-bold', 'qalam', 'me-quran'];
const animTime = 500;
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {isDefined} from "ionic-angular/es2015/util/util";

@Component({
  selector: 'safha',
  templateUrl: 'safha.html',
  animations: [
    trigger('pageState', [
      state('inactivePrev', style({
        opacity: 0,
        zIndex: -10,
        top: '-300px',
        position: 'fixed',
      })),
      state('active', style({
        // maxHeight: '',
        opacity: 1,
        zIndex: 1,
        top: '0px',
      })),
      state('inactiveNext', style({
        opacity: 0,
        zIndex: -10,
        top: '300px',
        position: 'fixed',
      })),
      transition('* => *', animate(animTime + 'ms linear')),
    ])
  ]
})
export class Safha implements OnInit, AfterViewInit {
  border: any;
  state = ['inactivePrev', 'active', 'inactiveNext'];
  layers = [0, 1, 2];
  previousTopTS: any;
  previousBottomTS: any;
  pinchObservable: Observable<any>;
  ayas;
  quranPage: number = 1;
  pageAyas={
    active:[],
    inactiveNext:[],
    inactivePrev:[],
  };
  height;
  width;
  pageWidth;
  horizontal = false;
  pageHeight;
  textWidth;
  textHeight;
  suraName;
  suraOrder;
  timer;
  zoom = 100;
  fontFamily = 'quran';
  reverse;
  naskhIncompatible = false;
  nigthMode = false;
  portrait;
  margin;
  @ViewChild('scrollPage') scrollPage;
  @ViewChildren('border') borders;
  private gesture: Gesture;

  constructor(private quranService: QuranService, private stylingService: StylingService, private platform: Platform, private screenOrientation: ScreenOrientation, public toastCtrl: ToastController) {
    this.naskhIncompatible = this.platform.is('ios');
    let fitScreen = () => {
      this.height = this.platform.height() - (this.platform.is('ios') ? 20 : 0);
      this.width = this.platform.width();
      this.portrait = this.platform.isPortrait();
      let wDiff = 83;
      let hDiff = 66;

      this.pageWidth = this.width;
      this.textWidth = this.pageWidth - wDiff - 10;
      this.textHeight = this.pageHeight - hDiff + Math.round(this.pageHeight / 40);
      this.margin = -55 + Math.round(this.width / 18.75);
    };
    this.platform.ready().then(() => {
      fitScreen();
    });
    this.screenOrientation.onChange().subscribe(() => {
      setTimeout(fitScreen, 1000)
    });
    if (!this.naskhIncompatible)
      this.fontFamily = 'quran-uthmanic';
  }

  isUthmanic(f = this.fontFamily) {
    return f.indexOf('uthmanic') !== -1 || f === 'me-quran';
  }

  ngOnInit() {
    this.quranService.getQuran()
      .subscribe(
        data => {
          this.ayas = data;
          this.loadPage();
        },
        (err: Response) => console.log("Error loading quran: ", err)
      );
    this.stylingService.zoomChanged$
      .subscribe(
        (zoom) => {
          this.zoom = 100 * Math.pow(1.125, zoom);
          this.resize(true);
        }
      );

    this.stylingService.fontChanged$
      .subscribe(
        (f) => {
          if (isNaN(f) && this.stylingService.fontFamily) {//on initial load
            this.fontFamily = this.stylingService.fontFamily;
          }
          else if (fonts[f % fonts.length]) {
            let tempFont;
            do {
              tempFont = fonts[f % fonts.length];
              f++;
            } while (tempFont && tempFont === this.fontFamily || (this.naskhIncompatible && this.isUthmanic(tempFont)));
            this.fontFamily = tempFont;
            this.stylingService.fontFamily = tempFont;
          }
        }
      );

    this.quranService.page$
      .subscribe(p => {
        this.quranPage = p;
        this.loadPage();
      });

  }

  resize(zoom = false) {

  }

  loadPage() {
    let ayas = this.quranService.applySectionFilter('page', this.ayas, this.quranPage);

    let suraOrders = ayas.map(e => e.sura).filter((e, i, v) => v.indexOf(e) === i);
    let suras = suraOrders.map(e => this.quranService.getSura(e));

    let suraNames = suras.map(e => e.name);

    let suraName = suraNames.pop();
    let suraOrder = suraOrders.pop();

    this.pageAyas.active = ayas;
    this.suraName = suraName;
    this.suraOrder = suraOrder;
    setTimeout(()=>this.scrollPage.scrollTo(0, 0, 0),animTime/2);
    setTimeout(() => {
      this.pageAyas.inactivePrev = ayas;
      this.pageAyas.inactiveNext = ayas;
    }, animTime);
  }

  ngAfterViewInit() {
    //create gesture obj w/ ref to DOM element
    this.borders.changes.subscribe(() => {
      this.border = this.borders._results.filter(e => e.nativeElement.id == 'active')[0];
      this.gesture = new Gesture(this.border.nativeElement);
      this.borders._results.forEach(r => {
        if (r.nativeElement.id !== 'active') {
          r.nativeElement.style.top = ( (r.nativeElement.id === 'inactivePrev' ? -1 : .3) * this.pageHeight )+ 'px';
        }
        else{
          r.nativeElement.style.position = 'relative';
        }
      });

      //listen for the gesture
      this.gesture.listen();

      this.pinchObservable = Observable.fromEventPattern(handler => this.gesture.on('pinch', handler)).throttleTime(500);
      this.pinchObservable.subscribe(e => this.pinch(e));
    });

    this.scrollPage.scrollTo(0, 0, 0);
  }

  swipe(e) {
    if (e.deltaX > 0) {
      this.goForth();
    }

    else {
      this.goBack();
    }
  }

  pinch(e) {
    /*
     Pinch event data (in iOS):
     {
     "pointers": [{
     "target": {},
     "identifier": 1758148171,
     "clientX": 134,
     "clientY": 463,
     "pageX": 134,
     "pageY": 463,
     "screenX": 134,
     "screenY": 463,
     "force": 0
     }, {
     "target": {},
     "identifier": 1758148172,
     "clientX": 241,
     "clientY": 380,
     "pageX": 241,
     "pageY": 380,
     "screenX": 241,
     "screenY": 380,
     "force": 0
     }],
     "changedPointers": [{
     "target": {},
     "identifier": 1758148171,
     "clientX": 134,
     "clientY": 463,
     "pageX": 134,
     "pageY": 463,
     "screenX": 134,
     "screenY": 463,
     "force": 0
     }],
     "pointerType": "touch",
     "srcEvent": {
     "touches": {
     "0": {
     "target": {},
     "identifier": 1758148171,
     "clientX": 134,
     "clientY": 463,
     "pageX": 134,
     "pageY": 463,
     "screenX": 134,
     "screenY": 463,
     "force": 0
     },
     "1": {
     "target": {},
     "identifier": 1758148172,
     "clientX": 241,
     "clientY": 380,
     "pageX": 241,
     "pageY": 380,
     "screenX": 241,
     "screenY": 380,
     "force": 0
     },
     "length": 2
     },
     "targetTouches": {
     "0": {
     "target": {},
     "identifier": 1758148171,
     "clientX": 134,
     "clientY": 463,
     "pageX": 134,
     "pageY": 463,
     "screenX": 134,
     "screenY": 463,
     "force": 0
     }, "length": 1
     },
     "changedTouches": {
     "0": {
     "target": {},
     "identifier": 1758148171,
     "clientX": 134,
     "clientY": 463,
     "pageX": 134,
     "pageY": 463,
     "screenX": 134,
     "screenY": 463,
     "force": 0
     }, "length": 1
     },
     "scale": 1.6384735107421875,
     "rotation": 1.4606246948242188,
     "ctrlKey": false,
     "shiftKey": false,
     "altKey": false,
     "metaKey": false,
     "isTrusted": true
     },
     "isFirst": false,
     "isFinal": false,
     "eventType": 2,
     "center": {"x": 188, "y": 422},
     "timeStamp": 1497362044323,
     "deltaTime": 130,
     "angle": 152.10272896905238,
     "distance": 19.235384061671343,
     "deltaX": -17,
     "deltaY": 9,
     "offsetDirection": 2,
     "overallVelocityX": -0.13076923076923078,
     "overallVelocityY": 0.06923076923076923,
     "overallVelocity": -0.13076923076923078,
     "scale": 1.642182908777933,
     "rotation": 283.1053747521382,
     "maxPointers": 2,
     "velocity": -0.4857142857142857,
     "velocityX": -0.4857142857142857,
     "velocityY": 0.2571428571428571,
     "direction": 2,
     "target": {},
     "additionalEvent": "pinchout",
     "type": "pinch"
     }*/

    if (e.additionalEvent === "pinchout")
      this.stylingService.zoomIn();
    else if (e.additionalEvent === "pinchin")
      this.stylingService.zoomOut();
    console.log(e);
  }

  goForth() {
    if (+this.quranPage < 604) {
      this.quranPage = +this.quranPage + 1;
      this.loadPage();
      let temp = [];
      this.state.forEach(e => temp.push(e));
      temp[this.state.findIndex(r => r === 'inactiveNext')] = 'active';
      temp[this.state.findIndex(r => r === 'active')] = 'inactivePrev';
      temp[this.state.findIndex(r => r === 'inactivePrev')] = 'inactiveNext';
      this.state = temp;
    }
    else {
      this.quranPage = 1;
      this.loadPage();
    }
  }

  goBack() {
    if (+this.quranPage > 1) {
      this.quranPage = +this.quranPage - 1;
      this.loadPage();
      let temp = [];
      this.state.forEach(e => temp.push(e));
      temp[this.state.findIndex(r => r === 'inactivePrev')] = 'active';
      temp[this.state.findIndex(r => r === 'active')] = 'inactiveNext';
      temp[this.state.findIndex(r => r === 'inactiveNext')] = 'inactivePrev';
      this.state = temp;
    }
    else {
      this.quranPage = 604;
      this.loadPage();
    }
  }

  onScroll(e) {
    if (e.scrollTop <= 0 || e.contentHeight + e.scrollTop > e.scrollHeight) {
      let contentDimensions = this.scrollPage.getContentDimensions();
      if (contentDimensions.scrollHeight < contentDimensions.contentHeight + contentDimensions.scrollTop) {
        if (e.timeStamp - this.previousBottomTS < 1000) {
          this.goForth();
        }
        this.previousBottomTS = e.timeStamp;
      }
      else if (contentDimensions.scrollTop <= 0) {
        if (e.timeStamp - this.previousTopTS < 1000) {
          this.goBack();
        }
        this.previousTopTS = e.timeStamp;
      }
    }
  }
}
