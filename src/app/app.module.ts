import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Deeplinks } from '@ionic-native/deeplinks';
import { IonicStorageModule } from '@ionic/storage';
import {HttpModule} from "@angular/http";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {Clipboard} from "@ionic-native/clipboard";
import {SocialSharing} from "@ionic-native/social-sharing";
import {Network} from "@ionic-native/network";
import {Vibration} from "@ionic-native/vibration";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {Safha} from "../components/safha/safha";
import {Hashia, JuzList, SuraList} from "../components/hashia/hashia";
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
import {CommitmentPage} from "../pages/commitment/commitment";
import {BookmarkService} from "../services/bookmark";
import {NativeAudio} from "@ionic-native/native-audio";
import {SocketService} from "../services/socket.service";
import {NotificationService} from "../services/notification.service";
import {Push} from "@ionic-native/push";
import {ProfilePage} from "../pages/profile/profile";
import { SingleSafhaComponent } from '../components/single-safha/single-safha';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
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
    CommitmentPage,
    SuraList,
    JuzList,
    ProfilePage,
    SingleSafhaComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Registration,
    CreateKhatmPage,
    CommitmentPage,
    SuraList,
    JuzList,
    ProfilePage,
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
    BookmarkService,
    SocialSharing,
    Clipboard,
    Network,
    Vibration,
    NativeAudio,
    SocketService,
    NotificationService,
    Push,
  ]
})
export class AppModule {
}
