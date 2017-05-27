import {Component, ViewChild} from '@angular/core';
import { Platform, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from '@ionic-native/deeplinks';

import { HomePage } from '../pages/home/home';
import {MsgService} from "../services/msg.service";
import {Registration} from "../pages/registration/registration";
import {AuthService} from "../services/auth.service";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navChild: Nav;

  rootPage:any = HomePage;
  isLoggedIn: boolean = false;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              deepLinks: Deeplinks, msgService: MsgService, authService: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      deepLinks.routeWithNavController(this.navChild, {
        '/auth/:hashlink': Registration
      }).subscribe(
        (match) => {
          msgService.showMessage('inform', 'Match:' + match, true);
        },
        (noMatch) => {
          msgService.showMessage('error', 'noMatch ' + noMatch, true);
        }
      );

      authService.isLoggedIn.subscribe(
        (data) => this.isLoggedIn = data
      );

    });
  }

  goToPage(event){
    console.log(event);
    if(event.isChanged){
      // if(event.page === 'register')
      this.navChild.push(event.page);
    }
  }
}

