import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
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
export class Safha implements OnInit, AfterViewInit {
  pinchObservable: Observable<any>;
  ayas;
  quranPage: number = 1;
  pageAyas;
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
  @ViewChild('border') border;
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

    this.pageAyas = ayas;
    this.suraName = suraName;
    this.suraOrder = suraOrder;
  }

  ngAfterViewInit() {
    //create gesture obj w/ ref to DOM element
    this.gesture = new Gesture(this.border.nativeElement);
    //listen for the gesture
    this.gesture.listen();

    this.pinchObservable = Observable.fromEventPattern(handler => this.gesture.on('pinch', handler)).throttleTime(500);
    this.pinchObservable.subscribe(e => this.pinch(e));
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
    if (+this.quranPage < 604) {
      this.quranPage = +this.quranPage + 1;
      this.loadPage();
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
    }
    else {
      this.quranPage = 604;
      this.loadPage();
    }
  }
}
