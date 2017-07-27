import {
  Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter, ViewChildren,
  AfterViewChecked, NgZone
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
  repeatIndex: any[] = [];
  scrollLock: boolean = false;
  private _pageIndex = 0;
  layerHeights: any = {};
  layerElements = [];
  shownPages: any = {};
  private _pages: any = [];
  pinchObservable: Observable<any>;
  ayas;
  private khatmActive: boolean = false;
  pageAyas: any = {};
  repeat: any = {};
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
  private layerIndices: string[] = [];

  get quranPage(): number {
    return this._pages[this._pageIndex];
  }

  set quranPage(p: number) {
    if (p === null) {
      this._pageIndex = Math.ceil(Math.random() * this.selectedPages.length);
    }
    else {
      this.shownPages = {};
      this.layerHeights = {};
      this.layerElements = [];
      let ind = this._pages.findIndex(r => r === p);
      if (ind !== -1) {
        this._pageIndex = ind;
        this.specifyPage([0, 1]);
      }
    }
  }

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
    this.getQuran();
  }

  get selectedPages(): number[] {
    return this._pages;
  }

  @Output() pageIsRead = new EventEmitter<number>();
  private gesture: Gesture;

  constructor(public zone: NgZone, private quranService: QuranService, private stylingService: StylingService, private platform: Platform, private screenOrientation: ScreenOrientation) {
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
    this.getQuran();
    this.stylingService.zoomChanged$
      .subscribe(
        (zoom) => {
          this.zoom = 100 * Math.pow(1.125, zoom);
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
            if (tempFont !== this.fontFamily) {
              this.fontFamily = tempFont;
              this.stylingService.fontFamily = tempFont;
            }
          }
        }
      );

    this.quranService.page$
      .subscribe(p => {
        this.quranPage = p;
      });

  }

  private getQuran() {
    this.quranService.getQuran()
      .subscribe(
        data => {
          this.ayas = data;
          this.repeat = {};
          this.repeatIndex = [];
          this.selectedPages.forEach(page => {
            let ayas = this.quranService.applySectionFilter('page', this.ayas, page);
            this.pageAyas[page] = ayas;
            this.repeat[page] = this.repeat[page] ? this.repeat[page] + 1 : 1;
            this.repeatIndex.push(this.repeat[page]);
          });
          this.specifyPage();
        },
        (err: Response) => console.log("Error loading quran: ", err)
      );
  }

  specifyPage(pages = [-1, 0, 1]) {
    let range = [];
    pages.forEach(i => range.push(this.pageIndexPlus(i)));
    range.forEach(p => {
        if (!this.shownPages[p]) {
          this.shownPages[p] = true;
        }
      }
    );

    if (Object.keys(this.shownPages).length > 20) {
      let sumHeight = 0;
      for (let key in this.layerHeights) {
        if (!range.includes(+key))
          sumHeight += this.layerHeights[key];
      }
      let st = this.scrollPage.getContentDimensions().scrollTop - sumHeight;
      if (st >= 0) {
        this.scrollLock = true;
        setTimeout(() => this.scrollPage.scrollTo(0, st, 0, () => console.log('scrolled to', st)), 100);
        for (let key in this.shownPages) {
          if (!range.includes(+key))
            delete this.shownPages[key];
        }
      }
    }

    let suraOrders = this.pageAyas[this._pages[this._pageIndex]].map(e => e.sura).filter((e, i, v) => v.indexOf(e) === i);
    let suras = suraOrders.map(e => this.quranService.getSura(e));

    let suraNames = suras.map(e => e.name);

    let suraName = suraNames.pop();
    let suraOrder = suraOrders.pop();
    this.suraName = suraName;
    this.suraOrder = suraOrder;
  }

  private pageIndexPlus(layer) {
    let ind = layer + this._pageIndex;
    if (ind < 0)
      ind = 0;
    else if (ind >= this._pages.length)
      ind = this._pages.length - 1;
    return ind;
  }

  ngAfterViewInit() {
    this.borders.changes.subscribe(() => {
      this.layerElements = this.borders._results.map(r => r.nativeElement);
      this.scrollLock = false;
      //enabling pinch, only for ios devices
      if (this.platform.is('ios')) {
        let activeLayer = this.layerElements.filter(e => e.id == this.quranPage)[0];
        if (activeLayer) {
          this.gesture = new Gesture(activeLayer);
          this.gesture.listen();
          this.pinchObservable = Observable.fromEventPattern(handler => this.gesture.on('pinch', handler)).throttleTime(500);
          this.pinchObservable.subscribe(e => this.pinch(e));
        }
      }
    });
  }

  ngAfterViewChecked() {
    this.layerHeights = {};
    this.layerElements.forEach(e => {
      this.layerHeights[e.id] = e.offsetHeight + 25;
    });
    this.layerIndices = this.layerElements.map(e => +e.id).sort((x, y) => x - y).map(r => r + '');
  }

  pinch(e) {
    if (e.additionalEvent === "pinchout")
      this.stylingService.zoomIn();
    else if (e.additionalEvent === "pinchin")
      this.stylingService.zoomOut();
    console.log(e);
  }

  onScroll(e) {
    if (!this.scrollLock) {
      let i = '', sumLayerHeights = 0;

      let found = this.layerIndices.some(key => {
        i = key;
        sumLayerHeights += this.layerHeights[key];
        return sumLayerHeights > e.scrollTop;
      });

      if (found && i && +i !== this._pageIndex)
        this.zone.run(() => {
          this.pageIsRead.emit(this._pageIndex);
          this._pageIndex = +i;
          this.specifyPage();
        });
    }
  }
}
