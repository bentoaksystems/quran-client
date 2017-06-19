import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {KhatmService} from "../../services/khatm.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private khatmService: KhatmService) {

  }

  readPage(khatm_id, page_number){
    this.khatmService.commitPages(khatm_id, page_number, true);
  }
}
