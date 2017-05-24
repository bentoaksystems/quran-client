import { Component } from '@angular/core';

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

  text: string;

  constructor() {
    console.log('Hello LeftMenuComponent Component');
    this.text = 'Hello World';
  }

}
