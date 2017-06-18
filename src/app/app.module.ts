import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Deeplinks} from '@ionic-native/deeplinks';
import {IonicStorageModule} from '@ionic/storage';
import {HttpModule} from "@angular/http";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {Clipboard} from "@ionic-native/clipboard";

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {Text} from "../pages/text/text";
import {Tasks} from "../pages/tasks/tasks";
import {Safha} from "../components/safha/safha";
import {Hashia} from "../components/hashia/hashia";
import {Aya} from "../components/aya/aya";
import {Alama} from "../components/alama/alama";
import {Shomara} from "../components/shomara/shomara";
import {Bismillah} from "../components/bismillah/bismillah";
import {Registration} from "../pages/registration/registration";
import {AuthService} from "../services/auth.service";
import {MsgService} from "../services/msg.service";
import {HttpService} from "../services/http.service";
import {QuranService} from "../services/quran.service";
import {StylingService} from "../services/styling";
import {LeftMenuComponent} from '../components/left-menu/left-menu';
import {RightMenuComponent} from '../components/right-menu/right-menu';
import {CreateKhatmPage} from "../pages/create-khatm/create-khatm";
import {LanguageService} from "../services/language";
import {KhatmService} from "../services/khatm.service";
import {SocialSharing} from "@ionic-native/social-sharing";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Text,
    Tasks,
    Safha,
    Hashia,
    Aya,
    Alama,
    Shomara,
    Bismillah,
    Registration,
    CreateKhatmPage,
    LeftMenuComponent,
    RightMenuComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Text,
    Tasks,
    Registration,
    CreateKhatmPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    MsgService,
    HttpService,
    QuranService,
    Deeplinks,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    QuranService,
    StylingService,
    ScreenOrientation,
    LanguageService,
    KhatmService,
    SocialSharing,
    Clipboard,
  ]
})
export class AppModule {
}

let a = {
  "pointers": [{
    "target": {},
    "identifier": 1370629,
    "clientX": 251,
    "clientY": 312,
    "pageX": 251,
    "pageY": 312,
    "screenX": 251,
    "screenY": 312,
    "force": 0
  }, {
    "target": {},
    "identifier": 1370630,
    "clientX": 126,
    "clientY": 462,
    "pageX": 126,
    "pageY": 462,
    "screenX": 126,
    "screenY": 462,
    "force": 0
  }],
  "changedPointers": [{
    "target": {},
    "identifier": 1370629,
    "clientX": 251,
    "clientY": 312,
    "pageX": 251,
    "pageY": 312,
    "screenX": 251,
    "screenY": 312,
    "force": 0
  }],
  "pointerType": "touch",
  "srcEvent": {
    "touches": {
      "0": {
        "target": {},
        "identifier": 1370629,
        "clientX": 251,
        "clientY": 312,
        "pageX": 251,
        "pageY": 312,
        "screenX": 251,
        "screenY": 312,
        "force": 0
      },
      "1": {
        "target": {},
        "identifier": 1370630,
        "clientX": 126,
        "clientY": 462,
        "pageX": 126,
        "pageY": 462,
        "screenX": 126,
        "screenY": 462,
        "force": 0
      },
      "length": 2
    },
    "targetTouches": {
      "0": {
        "target": {},
        "identifier": 1370629,
        "clientX": 251,
        "clientY": 312,
        "pageX": 251,
        "pageY": 312,
        "screenX": 251,
        "screenY": 312,
        "force": 0
      }, "length": 1
    },
    "changedTouches": {
      "0": {
        "target": {},
        "identifier": 1370629,
        "clientX": 251,
        "clientY": 312,
        "pageX": 251,
        "pageY": 312,
        "screenX": 251,
        "screenY": 312,
        "force": 0
      }, "length": 1
    },
    "scale": 1.5589103698730469,
    "rotation": 1.2886466979980469,
    "ctrlKey": false,
    "shiftKey": false,
    "altKey": false,
    "metaKey": false,
    "isTrusted": true
  },
  "isFirst": false,
  "isFinal": false,
  "eventType": 2,
  "center": {"x": 189, "y": 387},
  "timeStamp": 1497359597092,
  "deltaTime": 297,
  "angle": 75.96375653207353,
  "distance": 8.246211251235321,
  "deltaX": 2,
  "deltaY": 8,
  "offsetDirection": 16,
  "overallVelocityX": 0.006734006734006734,
  "overallVelocityY": 0.026936026936026935,
  "overallVelocity": 0.026936026936026935,
  "scale": 1.558910333483917,
  "rotation": -101.67750260063205,
  "maxPointers": 2,
  "velocity": 0.02564102564102564,
  "velocityX": 0.02564102564102564,
  "velocityY": 0.02564102564102564,
  "direction": 1,
  "target": {},
  "additionalEvent": "pinchout",
  "type": "pinch"
}
