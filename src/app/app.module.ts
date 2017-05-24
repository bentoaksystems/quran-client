import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {Text} from "../pages/text/text";
import {Tasks} from "../pages/tasks/tasks";
import {Safha} from "../components/safha/safha";
import {Hashia} from "../components/hashia/hashia";
import {Aya} from "../components/aya/aya";
import {Alama} from "../components/alama/alama";
import {Shomara} from "../components/shomara/shomara";
import {Bismillah} from "../components/bismillah/bismillah";
import {QuranService} from "../services/quran.service";
import {HttpModule} from "@angular/http";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {StylingService} from "../services/styling";

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
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Text,
    Tasks,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    QuranService,
    StylingService,
    ScreenOrientation,
  ]
})
export class AppModule {}
