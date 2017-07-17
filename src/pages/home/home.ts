import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';

import {KhatmService} from "../../services/khatm.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  khatm: any = null;
  khatmPagesInfo: any = [];
  khatmPages: number[] = [];

  constructor(public navCtrl: NavController, private khatmService: KhatmService) {}

  ngOnInit(){
    this.khatmService.activeKhatm.subscribe(
      (data) => {
        this.khatm = data;

        if(data !== null){
          //Get khatm commitment pages
          this.khatmService.loadCommitments(this.khatm.khid)
            .then(res => {
              this.khatmPagesInfo = res;
              this.khatmPages = this.khatmPagesInfo.map(el => el.page_number);
            })
            .catch(err => {
              this.khatmPages = [];
              console.log(err);
            })
        }
        else
          this.khatmPages = [];
      },
      (err) => {
        console.log(err);
      }
    )
  }

  readPage(page_index){
    if(this.khatm !== null)
      this.khatmService.commitPages(this.khatm.khid, [this.khatmPagesInfo[page_index]], true);
  }
}
