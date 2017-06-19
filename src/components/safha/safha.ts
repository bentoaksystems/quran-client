import {
  Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter, ViewChildren,
  AfterViewChecked, ChangeDetectorRef, NgZone
} from '@angular/core';
import {QuranService} from "../../services/quran.service";
import {Platform, ToastController} from "ionic-angular";
import {Response} from "@angular/http";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {StylingService} from "../../services/styling";
import {Gesture} from 'ionic-angular';
import {Observable} from "rxjs/Observable";

const fonts = ['quran', 'quran-uthmanic', 'quran-uthmanic-bold', 'qalam', 'me-quran'];

@Component({
  selector: 'safha',
  templateUrl: 'safha.html',
})
export class Safha implements OnInit, AfterViewInit, AfterViewChecked {
  scrollEnabled: any;
  private to: any;
  private _pageIndex = 0;
  layerHeight = {
    minus: null,
    active: null,
    plus: null,
  };
  layerElements = [];
  private _pages: number[] = [];
  layers = ['minus', 'active', 'plus'];
  pinchObservable: Observable<any>;
  ayas;
  private khatmActive: boolean = false;

  get quranPage(): number {
    return this._pages[this._pageIndex];
  }

  set quranPage(p: number) {
    if (p === null) {
      this._pageIndex = Math.ceil(Math.random() * this.selectedPages.length);
    }
    else {
      let ind = this._pages.findIndex(r => r === p);
      if (ind !== -1) {
        this._pageIndex = ind;
      }
    }
  }

  pageAyas = {
    minus: [],
    active: [],
    plus: [],
  };
;
  height;
  width;
  pageWidth;
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
  portrait;
  margin;
  @ViewChild('scrollPage') scrollPage;
  @ViewChildren('border') borders;

  @Input()
  set selectedPages(pages: number[]) {
    if (pages === null || !pages.length) {
      this._pages = [];
      for (let i = 1; i < 605; i++)this._pages.push(i);
      this.khatmActive = false;
    }
    else {
      this._pages = pages;
      this.khatmActive = true;
    }
    this.ngOnInit();
  }

  get selectedPages(): number[] {
    return this._pages;
  }

  @Output() pageIsRead = new EventEmitter<number>();
  private gesture: Gesture;

  constructor(public zone: NgZone, private quranService: QuranService, private stylingService: StylingService, private platform: Platform, private screenOrientation: ScreenOrientation, public toastCtrl: ToastController) {
    if (!this._pages.length)
      this.selectedPages = [];

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
          this.loadLayers();
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
        this.loadLayers();
      });

  }

  resize(zoom = false) {

  }

  loadPage(page, layer) {
    let ayas = this.quranService.applySectionFilter('page', this.ayas, page);

    let suraOrders = ayas.map(e => e.sura).filter((e, i, v) => v.indexOf(e) === i);
    let suras = suraOrders.map(e => this.quranService.getSura(e));

    let suraNames = suras.map(e => e.name);

    let suraName = suraNames.pop();
    let suraOrder = suraOrders.pop();

    this.pageAyas[layer] = ayas;
    this.suraName = suraName;
    this.suraOrder = suraOrder;
  }

  loadLayers() {
    this.layers.forEach((layer, li) => {
      let ind = li + this._pageIndex - 1;
      if (ind < 0)
        ind = this._pages.length - 1;
      if (ind >= this._pages.length)
        ind = 0;

      if (li === 1)
        this._pageIndex = ind;

      this.loadPage(this._pages[ind], layer)
    })
  }

  ngAfterViewInit() {
    this.borders.changes.subscribe(() => {
      this.layerElements = this.borders._results.map(r => r.nativeElement);

      //enabling pinch, only for ios devices
      if (this.platform.is('ios')) {
        let activeLayer = this.layerElements.filter(e => e.id == 'active')[0];
        this.gesture = new Gesture(activeLayer);
        this.gesture.listen();
        this.pinchObservable = Observable.fromEventPattern(handler => this.gesture.on('pinch', handler)).throttleTime(500);
        this.pinchObservable.subscribe(e => this.pinch(e));

      }
    });
  }

  ngAfterViewChecked() {
    this.layerElements.forEach(e => {
      this.layerHeight[e.id] = e.offsetHeight + 25;
    });
    this.to = null;
    this.scrollPage.scrollTo(0, this.layerHeight['minus'], 0,()=>this.toggleScroll(true));
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
    if (e.additionalEvent === "pinchout")
      this.stylingService.zoomIn();
    else if (e.additionalEvent === "pinchin")
      this.stylingService.zoomOut();
    console.log(e);
  }

  goForth() {
    this.layerElements[2].children[0]=this.layerElements[1].children[0];
    this._pageIndex++;
    this.loadLayers();
  }

  goBack() {
    this.layerElements[1].children[0]=this.layerElements[0].children[0];
    this._pageIndex--;
    this.loadLayers();
  }

  onScroll(e) {
    if (e.scrollTop >= this.layerHeight['minus'] + this.layerHeight['active']) {
      if (!this.to) {
        console.log('bottom', e);
        this.zone.run(() => {
          this.to = setTimeout(() => {
            this.toggleScroll(false);
            this.goForth();
          }, 0);
        })
      }
    }

    if (e.scrollTop <= 0) {
      if (!this.to) {
        console.log('top', e);
        this.zone.run(() => {
          this.to = setTimeout(() => {
            this.toggleScroll(false);
            this.goBack();
          }, 0);
        })
      }
    }
  }

  toggleScroll(scrollEnabled){
    let scroll = this.scrollPage.getScrollElement();
    if(!scrollEnabled){
      scroll.style.overflowY = 'hidden';
    }
    else {
      scroll.style.overflowY = 'scroll'
    }
  }
}
