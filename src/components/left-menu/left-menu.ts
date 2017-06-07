import { Component } from '@angular/core';
import {StylingService} from "../../services/styling";
import {MenuController} from "ionic-angular";
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
export class LeftMenuComponent {

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
              private ls:LanguageService,
            ) {
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
    this.menuCtrl.close();
  }

  changeLanguage(){
    this.menuCtrl.close();
  }
}
