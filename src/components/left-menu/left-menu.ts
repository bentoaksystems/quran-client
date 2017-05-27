import { Component } from '@angular/core';
import {StylingService} from "../../services/styling";
import {MenuController} from "ionic-angular";

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

  constructor(private stylingService:StylingService,private menuCtrl:MenuController) {

  }

  zoomIn(){
    this.stylingService.zoomIn();
    this.menuCtrl.close();
  }

  zoomOut(){
    this.stylingService.zoomOut();
    this.menuCtrl.close();
  }

  changeFont(){
    this.stylingService.fontChange();
    this.menuCtrl.close();
  }

  nightMode(){
    this.stylingService.nightModeSwitch();
    this.menuCtrl.close();
  }
}
