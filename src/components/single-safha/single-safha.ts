import {
  AfterViewChecked,
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {QuranService} from "../../services/quran.service";
import {StylingService} from "../../services/styling";
import {Platform} from "ionic-angular";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {BookmarkService} from "../../services/bookmark";
import {MsgService} from "../../services/msg.service";
import {NativeAudio} from "@ionic-native/native-audio";
import {LanguageService} from "../../services/language";
import {ScrollDirection} from "../../enum/scroll.direction.enum";
import {QuranReference} from "../../services/quran-data";

const fonts = ['quran', 'quran-uthmanic', 'quran-uthmanic-bold', 'qalam', 'me-quran'];
const zeroPad = num => {
  let zero = 3 - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
};

@Component({
  selector: 'single-safha',
  templateUrl: 'single-safha.html'
})
export class SingleSafhaComponent implements OnInit, OnChanges, AfterViewChecked{
  private playing: boolean = false;
  private preloaded: any = {};
  scrollLock: boolean = false;
  scrollDirectionTemp = null;
  scrollDirection = ScrollDirection;
  page: any;
  suraOrder: any;
  suraName: string = '';
  suraNumbers: number[] = [];
  private _pages = [];
  khatmActive = false;
  selectedAya: QuranReference = {aya: null, sura: null, substrIndex: null};

  get quranPage(): any {
    // return this._pages[this._pageIndex];
    return this._pages[this.currentIndex];
  }

  set quranPage(p: any) {
    if (p === null || p === '') {
      this.currentIndex = Math.ceil(Math.random() * this.selectedPages.length);
    }
    else {
      let ind = this._pages.findIndex(r => r === p);
      if (ind !== -1) {
        this.currentIndex = ind;
        this.goToPage();
        // this.scrollToSuraTop(this.quranService.suraNumber);
        this.bookmarkService.setPageNumber(p);
        this.bookmarkService.setScrollLocation(0);
      }
    }
  }

  @Output() pageIsRead = new EventEmitter<number>();

  @Input()
  get selectedPages(): number[] {
    return this._pages;
  }

  set selectedPages(pages: number[]) {
    if (pages === null || !pages.length) {
      this._pages = [];
      for (let i = 1; i < 605; i++)this._pages.push(i);
      if (this.khatmActive) {
        this.currentIndex = this.bookmarkService.pageNumber ? this.bookmarkService.pageNumber - 1 : 0;
      }
      this.khatmActive = false;
    }
    else {
      this._pages = pages;
      this.currentIndex = 0;
      this.khatmActive = true;
      this.scrollPage.scrollTo(0, 0, 0);
    }
    this.getQuran().then(() =>{
      this.scrollDirectionTemp = this.scrollDirection.bottom;
      this.goToPage();
    }).catch(err => console.log('Error in getting quran', err));
  }
  ayas;
  repeat: any = {};
  repeatIndex: any[] = [];
  pageAyas: any = {};
  zoom = 100;
  fontFamily = 'quran';
  currentIndex = 0;
  @ViewChild('scrollPage') scrollPage;
  @ViewChild('border') border: ElementRef;
  notScrollable: number = 0;
  height: number;
  width: number;
  portrait: boolean;
  margin: number;

  constructor(private quranService: QuranService,
              private stylingService: StylingService,
              private platform: Platform,
              private screenOrientation: ScreenOrientation,
              private bookmarkService: BookmarkService,
              private msg: MsgService,
              private audio: NativeAudio,
              private ls: LanguageService) {

    this.platform.ready().then(() => {
      this.fitScreen();
    });
    this.screenOrientation.onChange().subscribe(() => {
      setTimeout(()=>this.fitScreen(), 500)
    });
  }

  private fitScreen() {
    this.height = this.platform.height() - (this.platform.is('ios') ? 20 : 0);
    this.width = this.platform.width();
    this.portrait = this.platform.isPortrait();
    this.margin = -55 + Math.round(this.width / 18.75);
  };

  ngOnInit(): void {
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
            } while (tempFont && tempFont === this.fontFamily);
            if (tempFont !== this.fontFamily) {
              this.fontFamily = tempFont;
              this.stylingService.fontFamily = tempFont;
            }
          }
        }
      );

    this.quranService.page$
      .subscribe(p => {
        this.scrollDirectionTemp = this.scrollDirection.bottom;
        this.quranPage = p;
      });

    let bp = this.bookmarkService.pageNumber$.subscribe(p => {
      this.scrollDirectionTemp = this.scrollDirection.bottom;
      this.quranPage = p;
      bp.unsubscribe();
    });

    let bl = this.bookmarkService.scrollLocation$.subscribe(s => {
      this.scrollPage.scrollTo(0, s, 0);
      bl.unsubscribe();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes: ', changes);
    if(changes.border) {
      this.notScrollable =  this.height > this.border.nativeElement.offsetHeight ? this.height - this.border.nativeElement.offsetHeight : 0;
      console.log('Change border');
    }
  }

  ngAfterViewChecked() {
    if(this.scrollDirectionTemp === this.scrollDirection.top)
      this.scrollPage.scrollTo(0, this.border.nativeElement.offsetHeight - 550, 0);
    else if(this.scrollDirectionTemp === this.scrollDirection.bottom)
      if(this.currentIndex === 0)
        this.scrollPage.scrollTo(0, 0, 0);
      else
        this.scrollPage.scrollTo(0, 85, 0);

    this.scrollDirectionTemp = null;
  }

  private getQuran() {
    return new Promise((resolve, reject) => {
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
            resolve();
          },
          (err: Response) => {
            reject(err);
          }
        );
    });
  }

  menuToggle() {
    this.msg.dismiss();
  }

  onAyaSelected(e){
    if (e.selected) {
      this.selectedAya.aya = e.aya.aya;
      this.selectedAya.sura = e.aya.sura;
      let bs = this.bookmarkService.scrollLocation$.subscribe(s => {
        this.scrollPage.scrollTo(0, s, 0);
        bs.unsubscribe();
      });
    }
    else if (e.selected === false && this.selectedAya.aya === e.aya.aya && this.selectedAya.sura === e.aya.sura) {
      this.selectedAya.aya = null;
      this.selectedAya.sura = null;
    }
    else if (e.playStop) {
      if (this.playing) {
        this.playing = false;
      }
      else {
        this.playing = true;
        this.play(e.aya);
      }
    }
  }

  private play(e, curAyaIndex = this.ayas.findIndex(r => r.sura === this.selectedAya.sura && r.aya === this.selectedAya.aya)) {
    if (this.playing) {
      if (!e.aya) {//for Bismillah
        e.aya = 1;
        e.sura = 1;
      }
      let id = `${zeroPad(e.sura)}${zeroPad(e.aya)}.mp3`;
      let alink = `/assets/recitation/${id}`;
      let play = () => this.audio.play(id, () => {
        if (curAyaIndex + 1 < this.ayas.length) {
          let nextAya = this.ayas[curAyaIndex + 1];
          this.selectedAya = {sura: nextAya.sura, aya: nextAya.aya, substrIndex: null};
          this.play(nextAya, curAyaIndex + 1);
        }
      });

      if (this.preloaded[id])
        play();
      else
        this.audio.preloadComplex(id, alink, 1, 1, 0)
          .then(() => {
            play();
            this.preloaded[id] = true;
          })
          .catch(err => console.log(err));

    }
  }

  private registerBorder(){
    this.notScrollable =  this.height > this.border.nativeElement.offsetHeight ? this.height - this.border.nativeElement.offsetHeight : 0;
  }

  private goToPage() {
    if( this._pages.length) {
      this.page = this._pages[this.currentIndex];
      this.suraNumbers = this.pageAyas[this.page].map(e => e.sura).filter((e, i, v) => v.indexOf(e) === i);
      let suras = this.suraNumbers.map(e => this.quranService.getSura(e));
      let suraNames = suras.map(e => e.name);
      let suraName = (this.pageAyas[this.page][0].bismillah === true) ? suraNames[0] : (suraNames[1] ? suraNames[1] : suraNames[0]);
      let suraOrder = (this.pageAyas[this.page][0].bismillah === true) ? this.suraNumbers[0] : (this.suraNumbers[1] ? this.suraNumbers[1] : this.suraNumbers[0]);
      this.suraName = suraName;
      this.suraOrder = suraOrder;

      if(!this.khatmActive)
        this.bookmarkService.setPageNumber(this.quranPage);
    }
  }

  nextPage(sd, infiniteScroll){
    if(this.scrollLock){
      infiniteScroll.complete();
      return;
    }

    if(sd === this.scrollDirection.top){
      this.currentIndex--;
      this.scrollDirectionTemp = this.scrollDirection.top;
    }
    else{
      this.scrollDirectionTemp = this.scrollDirection.bottom;

      if(this.khatmActive)
        this.pageIsRead.emit(this.currentIndex);

      this.currentIndex++;
    }

    if(this.currentIndex > 603 || this.currentIndex > this.selectedPages.length - 1)
      infiniteScroll.enable(false);
    else{
      infiniteScroll.enable(true);
      this.goToPage();
    }

    this.registerBorder();

    infiniteScroll.complete();

    this.scrollLock = true;
    setTimeout(() => this.scrollLock = false, 600);
  }
}
