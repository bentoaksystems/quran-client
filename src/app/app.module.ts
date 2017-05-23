import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Deeplinks } from '@ionic-native/deeplinks';
import { IonicStorageModule } from '@ionic/storage';
import {HttpModule} from "@angular/http";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {Text} from "../pages/text/text";
import {Tasks} from "../pages/tasks/tasks";
import {Registration} from "../pages/registration/registration";
import {AuthService} from "../services/auth.service";
import {MsgService} from "../services/msg.service";
import {HttpService} from "../services/http.service";
import {QuranService} from "../services/quran.service";
import {Verification} from "../pages/verification/verification";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Text,
    Tasks,
    Registration,
    Verification,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Text,
    Tasks,
    Registration,
    Verification,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    MsgService,
    HttpService,
    QuranService,
    Deeplinks,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
