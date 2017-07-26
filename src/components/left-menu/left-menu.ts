import { Component } from '@angular/core';
import {StylingService} from "../../services/styling";
import {ActionSheetController, MenuController} from "ionic-angular";
import {LanguageService} from "../../services/language";

const fonts = ['quran', 'quran-uthmanic', 'quran-uthmanic-bold', 'qalam', 'me-quran'];

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
export class LeftMenuComponent {
  conditionalColoring: any = {
    background: 'normal_back',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };
  sampleChangingFont: any = {"sura":78,"aya":1,"text":"عَمَّ يَتَسَآءَلُونَ"};
  fontFamily = 'quran';
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
      acronym: 'fa',
      name: 'فارسی'
    },
  ];
  constructor(private stylingService:StylingService,
              private menuCtrl:MenuController,
              private ls:LanguageService, private actionSheetController: ActionSheetController) {
    this.stylingService.nightMode$.subscribe(
      (data) => {
        if(data) {
          this.conditionalColoring.background = 'night_back';
          this.conditionalColoring.text = 'night_text';
          this.conditionalColoring.primary = 'night_primary';
          this.conditionalColoring.secondary = 'night_secondary';
        }
        else{
          this.conditionalColoring.background = 'normal_back';
          this.conditionalColoring.text = 'normal_text';
          this.conditionalColoring.primary = 'normal_primary';
          this.conditionalColoring.secondary = 'normal_secondary';
        }
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
