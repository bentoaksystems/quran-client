import {Component, ViewChild} from '@angular/core';
import { Platform, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from '@ionic-native/deeplinks';

import { HomePage } from '../pages/home/home';
import {AuthService} from "../services/auth.service";
import {LanguageService} from "../services/language";
import {CreateKhatmPage} from "../pages/create-khatm/create-khatm";
import {KhatmService} from "../services/khatm.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navChild: Nav;
  @ViewChild('rightMenu') rightMenu;

  rootPage:any = HomePage;
  isLoggedIn: boolean = false;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              authService: AuthService, private ls:LanguageService,
              private deeplinks: Deeplinks, private khatmService: KhatmService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      deeplinks.routeWithNavController(this.navChild, {
        '/khatm': CreateKhatmPage
      })
          .subscribe(
              (match) => {
                console.log('Successfully match: ',  match);
              },
              (noMatch) => {
                console.log('Cannot match: ', noMatch);
              }
          );

      authService.isLoggedIn.subscribe(
        (data) => this.isLoggedIn = data);

      authService.user.subscribe(
        (u) => {
          if(u !== null && u.token !== null && u.token !== undefined){
            this.khatmService.loadKhatm(u);
            this.khatmService.loadAllCommitments();
          }
        }
      )
    });
  }

  goToPage(event){
    console.log(event);
    if(event.shouldClose)
      this.rightMenu.close();

    if(event.isChanged)
      this.navChild.push(event.page, event.params);
  }
}

