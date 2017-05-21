import { Component } from '@angular/core';

/**
 * Generated class for the Alama component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'alama',
  templateUrl: 'alama.html'
})
export class Alama {

  text: string;

  constructor() {
    console.log('Hello Alama Component');
    this.text = 'Hello World';
  }

}
