import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {Vibration} from "@ionic-native/vibration";

import {KhatmService} from "../../services/khatm.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  khatm: any = null;
  khatmPagesInfo: any = [];
  khatmPages: number[] = [];

  constructor(public navCtrl: NavController, private khatmService: KhatmService,
              private vibration: Vibration) {}

  ngOnInit(){
    this.khatmService.activeKhatm.subscribe(
      (data) => {
        this.khatm = data;

        if(data !== null){
          //Get khatm commitment pages
          this.khatmService.loadCommitments(this.khatm.khid)
            .then(res => {
              this.khatmPagesInfo = res.sort((a, b) => {
                if(a.repeat_number > b.repeat_number)
                  return 1;
                else if(a.repeat_number < b.repeat_number)
                  return -1;
                else {
                  if(a.page_number > b.page_number)
                    return 1;
                  else if(a.page_number < b.page_number)
                    return -1;
                  else
                    return 0;
                }
              });
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
    if(this.khatmService.isAutomaticCommit && this.khatm !== null && this.khatmService.activeKhatm.getValue().khid === this.khatm.khid) {
      this.vibration.vibrate(100);
      this.khatmService.updateKhatmDetails(this.khatm.khid, true);
      this.khatmService.commitPages(this.khatm.khid, [this.khatmPagesInfo[page_index]], true);
    }
  }
}
