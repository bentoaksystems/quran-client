import { Component } from '@angular/core';

/**
 * Generated class for the Hashia component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'hashia',
  templateUrl: 'hashia.html'
})
export class Hashia {

  text: string;

  constructor() {
    console.log('Hello Hashia Component');
    this.text = 'Hello World';
  }

}
