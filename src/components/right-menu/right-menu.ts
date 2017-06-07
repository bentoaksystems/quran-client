import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

import {AuthService} from "../../services/auth.service";
import {Registration} from "../../pages/registration/registration";
import {HomePage} from "../../pages/home/home";
import {CreateKhatmPage} from "../../pages/create-khatm/create-khatm";
import {LanguageService} from "../../services/language";
import {KhatmService} from "../../services/khatm.service";
import {MsgService} from "../../services/msg.service";

@Component({
  selector: 'right-menu',
  templateUrl: 'right-menu.html'
})
export class RightMenuComponent implements OnInit{
  @Input() isLoggedIn: boolean;
  @Output() switchView = new EventEmitter<any>();
  khatms: any;

  constructor(private authService: AuthService, private ls:LanguageService,
              private khatmService: KhatmService, private msgService: MsgService) {}

  openPage(desPage, viewKhatm = null){
    console.log(desPage);

    var target;
    var params;

    if(desPage === 'register')
      target = Registration;
    else if(desPage === 'khatm') {
      target = CreateKhatmPage;

      if(viewKhatm !== null){
        params = {
          isNew: false,
          khatm: viewKhatm
        }
      }
      else {
        params = {
          isNew: true,
          khatm: null
        }
      }
    }
    else
      target = HomePage;

    var data = {
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
          for(let item of data)
            this.khatms.push(item);
        },
        (err) => {
          console.log(err.message);
          this.msgService.showMessage('error', err.message);
        }
    );

    this.authService.user.subscribe(
        (data) => {
            if(data !== null)
              this.khatmService.loadKhatm(data.email)
        },
        (err) => console.log(err.message)
    );
  }

  logout(){
    this.authService.logout();
  }

}
