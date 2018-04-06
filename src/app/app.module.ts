import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Home } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { ProductoPage } from '../pages/producto/producto';
import { PedidosPage } from '../pages/pedidos/pedidos';
import { PedidoPage } from '../pages/pedido/pedido';
import { ProfilePage } from '../pages/profile/profile';
import { PedidoGuiadoPage } from '../pages/pedido-guiado/pedido-guiado';
import { PedidoRestringidoPage } from '../pages/pedido-restringido/pedido-restringido';
import { VerPedidoPage } from '../pages/ver-pedido/ver-pedido';
import { LoginPage } from '../pages/login/login';
import { Api } from '../providers/Api';
import { IonicStorageModule } from '@ionic/storage';
import { MomentModule } from 'angular2-moment';
import { HomePage } from "../pages/home/home";
import { TutorialPage } from "../pages/tutorial/tutorial";
import { Terms } from "../pages/terms/terms";

import { Selector } from "../pages/selector/selector";
import * as moment from 'moment';
import 'moment/min/locales';
moment.locale("es");

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { CodePush } from '@ionic-native/code-push';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Push } from '@ionic-native/push';
import { Clipboard } from '@ionic-native/clipboard';
import { FaqPage } from "../pages/faq/faq";
@NgModule({
  declarations: [
    MyApp,
    Home,
    Page2,
    ProductoPage,
    PedidosPage,
    PedidoPage,
    PedidoGuiadoPage,
    PedidoRestringidoPage,
    ProfilePage,
    VerPedidoPage,
    HomePage,
    LoginPage,
    TutorialPage,
    Terms,
    FaqPage,
    Selector,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    Page2,
    ProductoPage,
    PedidosPage,
    PedidoPage,
    PedidoGuiadoPage,
    PedidoRestringidoPage,
    ProfilePage,
    VerPedidoPage,
    HomePage,
    LoginPage,
    TutorialPage,
    Terms,
    FaqPage,
    Selector
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Api,
    CodePush, SplashScreen, StatusBar, LocalNotifications, Push, Clipboard 
  ]
})
export class AppModule { }
