import { Component } from '@angular/core';

/**
 * Generated class for the Shomara component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'shomara',
  templateUrl: 'shomara.html'
})
export class Shomara {

  text: string;

  constructor() {
    console.log('Hello Shomara Component');
    this.text = 'Hello World';
  }

}
