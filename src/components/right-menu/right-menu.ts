import {Component, Input, Output, EventEmitter} from '@angular/core';

import {AuthService} from "../../services/auth.service";
import {Registration} from "../../pages/registration/registration";
import {HomePage} from "../../pages/home/home";
import {LanguageService} from "../../services/language";

@Component({
  selector: 'right-menu',
  templateUrl: 'right-menu.html'
})
export class RightMenuComponent {
  @Input() isLoggedIn: boolean;
  @Output() switchView = new EventEmitter<any>();

  constructor(private authService: AuthService,
              private ls:LanguageService,
             ) {

  }

  openPage(desPage){
    console.log(desPage);
    var data = {
      isChanged: true,
      page: (desPage === 'register') ? Registration : HomePage
    };

    this.switchView.emit(data);
  }

  logout(){
    this.authService.logout();
  }

}
