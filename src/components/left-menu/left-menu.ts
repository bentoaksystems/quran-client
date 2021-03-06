import {Component, OnInit} from '@angular/core';
import {StylingService} from "../../services/styling";
import {ActionSheetController, MenuController} from "ionic-angular";
import {LanguageService} from "../../services/language";

/**
 * Generated class for the LeftMenuComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'left-menu',
  templateUrl: 'left-menu.html'
})
export class LeftMenuComponent implements OnInit{
  fontFamily: string = 'quran-uthmanic';

  ngOnInit(): void {
    this.zoom = 262.5 * Math.pow(1.125, this.stylingService.curZoom);

    this.stylingService.fontFamily$.subscribe(
      (font) => {
        if(font !== null && font !== undefined)
          this.fontFamily = font;
      }
    )
  }

  sampleChangingFont: any = {"sura":78,"aya":1,"text":"عَمَّ يَتَسَآءَلُونَ"};
  zoom = 262.5;
  naskhIncompatible = false;

  langs = [
    {
      acronym: 'en',
      name: 'English'
    },
    {
      acronym: 'ar',
      name: 'العربية'
    },
    {
      acronym: 'ur',
      name:'اُردُو'
    },
    {
      acronym: 'id',
      name: 'Malay'
    },
    {
      acronym: 'tr',
      name: 'Türkçe',
    },
    {
      acronym: 'fa',
      name: 'فارسی'
    },
  ];
  constructor(private stylingService:StylingService,
              private menuCtrl:MenuController,
              private ls:LanguageService, private actionSheetController: ActionSheetController) {
    this.stylingService.zoomChanged$
      .subscribe(
        (zoom) => {
          this.zoom = 262.5 * Math.pow(1.125, zoom);
        }
      );
  }

  zoomIn(){
    this.stylingService.zoomIn();
  }

  zoomOut(){
    this.stylingService.zoomOut();
  }

  changeFont(){
    this.stylingService.fontChange();
  }

  nightMode(){
    this.stylingService.nightModeSwitch();
  }

  changeLanguage(){
    let buttons: any = [];

    this.langs.forEach(el => {
      buttons.push({
        text: el.name,
        handler: () => {
          this.ls.lang = el.acronym
        }
      });
    });

    buttons.push({
      text: 'Cancel',
      role: 'cancel'
    });

    this.actionSheetController.create({
      title: this.ls.translate('Change App Language'),
      buttons: buttons,
      enableBackdropDismiss: true,
      cssClass: (this.stylingService.nightMode) ? 'night_mode' : 'day_mode'
    }).present();
  }

  isUthmanic(f = this.fontFamily) {
    return f.indexOf('uthmanic') !== -1 || f === 'me-quran';
  }
}
