import {Component, OnInit, ViewChild} from '@angular/core';
import {QuranService} from "../../services/quran.service";
import {Platform, ToastController, NavController} from "ionic-angular";
import {Response} from "@angular/http";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {StylingService} from "../../services/styling";
import {Gesture} from 'ionic-angular';
const fonts = ['quran', 'quran-uthmanic', 'quran-uthmanic-bold', 'qalam', 'me-quran'];

@Component({
  selector: 'safha',
  templateUrl: 'safha.html'
})
export class Safha implements OnInit {
  ayas;
  quranPage: number = 1;
  pageAyas;
  height;
  width;
  pageWidth;
  horizontal = false;
  pageHeight;
  textWidth;
  textHeight;
  suraName;
  suraOrder;
  tanzilLocation;
  quranPages;
  timer;
  zoom = 100;
  fontFamily = 'quran';
  reverse;
  naskhIncompatible = false;
  nigthMode = false;
  portrait;
  margin;
  @ViewChild('scrollPage') scrollPage;
  private gesture: Gesture;

  ionViewDidLoad() {
    //create gesture obj w/ ref to DOM element
    this.gesture = new Gesture(this.scrollPage.nativeElement);

    //listen for the gesture
    this.gesture.listen();
  }

  constructor(private quranService: QuranService, private stylingService: StylingService, private platform: Platform, private screenOrientation: ScreenOrientation,public toastCtrl: ToastController) {
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
          this.zoom = 100 * Math.pow(1.25, zoom);
          console.log(this.zoom);
          this.resize(true);
        }
      );

    this.stylingService.fontChanged$
      .subscribe(
        (f) => {
          do {
            var tempFont = fonts[f % fonts.length];
            f++;
          } while (tempFont === this.fontFamily || (this.naskhIncompatible && this.isUthmanic(tempFont)));
          this.fontFamily = tempFont;
        }
      );

    this.stylingService.nightMode$
      .subscribe(
        (m) => {
          this.nigthMode = m;
          if (m) {
            document.body.style.backgroundColor = '#000';
            document.body.style.color = '#fff';
          }
          else {
            document.body.style.backgroundColor = '#fff';
            document.body.style.color = '#000';
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
    this.pageAyas = [];
    this.suraName = [];
    this.suraOrder = [];
    this.tanzilLocation = [];
    this.quranPages = [];

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

  swipe(e) {
    if (Math.abs(e.deltaX) > 50) {
      if (e.deltaX > 0)
        this.goForth();
      else
        this.goBack();
      this.scrollPage.scrollTo(0, 0, 0);
    }
  }

  pinch(e) {
    let toast = this.toastCtrl.create({
      message: JSON.stringify(e),
      duration: 3000,
      cssClass: 'alamaToast'
    });
    toast.present();
  }

  goForth() {
    if (+this.quranPage < 604) {
      this.quranPage = +this.quranPage + 1;
      this.loadPage()
    }
    else {
      this.quranPage = 1;
      this.loadPage();
    }
  }

  goBack() {
    if (+this.quranPage > 1) {
      this.quranPage = +this.quranPage - 1;
      this.loadPage()
    }
    else {
      this.quranPage = 604;
      this.loadPage();
    }
  }
}
