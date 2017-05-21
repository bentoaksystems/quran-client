import { Component } from '@angular/core';

/**
 * Generated class for the Safha component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'safha',
  templateUrl: 'safha.html'
})
export class Safha {

  text: string;

  constructor() {
    console.log('Hello Safha Component');
    this.text = 'Hello World';
  }

}
