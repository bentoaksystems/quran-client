import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

import {AuthService} from "../../services/auth.service";
import {Registration} from "../../pages/registration/registration";
import {HomePage} from "../../pages/home/home";
import {CreateKhatmPage} from "../../pages/create-khatm/create-khatm";
import {LanguageService} from "../../services/language";
import {KhatmService} from "../../services/khatm.service";
import {MsgService} from "../../services/msg.service";
import {StylingService} from "../../services/styling";

@Component({
  selector: 'right-menu',
  templateUrl: 'right-menu.html'
})
export class RightMenuComponent implements OnInit{
  @Input() isLoggedIn: boolean;
  @Output() switchView = new EventEmitter<any>();
  khatms: any;

  constructor(private authService: AuthService, private ls:LanguageService,
              private khatmService: KhatmService, private msgService: MsgService,
              private stylingService: StylingService) {}

  openPage(desPage, viewKhatm = null, fromButton = null){
    var target;
    var params;

    if(desPage === 'register'){
      target = Registration;
      params = {fromButton: fromButton};
    }
    else if(desPage === 'khatm') {
      target = CreateKhatmPage;

      if(viewKhatm !== null){
        params = {
          isNew: false,
          khatm: viewKhatm,
          isMember: true,
        }
      }
      else {
        params = {
          isNew: true,
          khatm: null,
          isMember: true,
        }
      }
    }
    else
      target = HomePage;

    var data = {
      shouldClose: true,
      isChanged: true,
      page: target,
      params: params
    };

    this.switchView.emit(data);
  }

  ngOnInit(){
    this.khatmService.khatms.subscribe(
      (data) => {
          this.khatms = [];
          if(data !== null)
            for(let item of data)
              this.khatms.push(item);
        },
      (err) => {
          console.log(err.message);
          this.msgService.showMessage('error', err.message);
        }
    );
  }

  logout(){
    this.authService.logout();
    this.khatmService.clearStorage();
  }

  start_stop_khatm(khatm){
    this.switchView.emit({shouldClose: true});
    this.khatmService.start_stop_Khatm(khatm);
  }
}
