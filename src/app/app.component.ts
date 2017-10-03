import {Component, ViewChild} from '@angular/core';
import { Platform, Nav, NavController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from '@ionic-native/deeplinks';

import { HomePage } from '../pages/home/home';
import {AuthService} from "../services/auth.service";
import {LanguageService} from "../services/language";
import {CreateKhatmPage} from "../pages/create-khatm/create-khatm";
import {KhatmService} from "../services/khatm.service";
import {MsgService} from "../services/msg.service";
import {NotificationService} from "../services/notification.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navChild: NavController;
  @ViewChild('rightMenu') rightMenu;

  rootPage:any = HomePage;
  isLoggedIn: boolean = false;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen,
              private authService: AuthService, private ls:LanguageService,
              private deeplinks: Deeplinks, private khatmService: KhatmService,
              private msgService: MsgService, private notification: NotificationService) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
     // this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngAfterViewInit(){
    this.platform.ready().then(() => {
      this.deeplinks.routeWithNavController(this.navChild, {
        '/khatm/:link': CreateKhatmPage
      }).subscribe(
        (match) => {
          let urlParts = match.$link.url.split('/');

          if(urlParts[2] === 'khatm')
            this.navChild.push(CreateKhatmPage, {link: urlParts[3]});
        },
        (nomatch) => {
          this.msgService.showMessage('error', 'Cannot find your requested page');
        }
      );

      this.authService.isLoggedIn.subscribe(
        (data) => {
          if(data)
            this.notification.initPushNotification(this.platform, this.navChild);
          this.isLoggedIn = data;
        });

      this.authService.user.subscribe(
        (u) => {
          if(u !== null && u.token !== null && u.token !== undefined){
            this.khatmService.saveNotJoinSeenKhatms('T_test', '2a10MsndgkpvF2PiF24XIDoulCOZg9cS9uLsCYXVMrQxwhYdl8oeG');
            this.khatmService.loadKhatms();
            this.khatmService.getNotJoinSeenKhatms();
          }
        }
      )
    })
  }

  goToPage(event){
    if(event.shouldClose)
      this.rightMenu.close();

    if(event.isChanged)
      this.navChild.push(event.page, event.params);
  }
}

