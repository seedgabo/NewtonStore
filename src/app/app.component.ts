import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, Events } from 'ionic-angular';

import { CodePush, InstallMode } from '@ionic-native/code-push';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PedidosPage } from '../pages/pedidos/pedidos';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { Api } from '../providers/Api';
import { HomePage } from "../pages/home/home";
import { TutorialPage } from "../pages/tutorial/tutorial";
import * as moment from 'moment';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any, icon: string }>;
  hora = 0;
  minutos = 0;
  constructor(public platform: Platform, public api: Api, public alert: AlertController,
    public codepush: CodePush, public statusbar: StatusBar, public splashscreen: SplashScreen, public events: Events) {
    this.initializeApp();
    events.subscribe('logout', () => {
      this.logout();
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusbar.styleDefault();
      this.splashscreen.hide();
      if (this.platform.is('android') || this.platform.is('ios')) {
        const downloadProgress = (progress) => { console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`); }
        this.codepush.sync({ updateDialog: false, installMode: InstallMode.ON_NEXT_RESUME, }, downloadProgress)
          .subscribe(
          (syncStatus) => { console.log(syncStatus) },
          (err) => { console.warn(err) }
          );
      }
    });
    this.hora = moment().hour();
    this.minutos = moment().minutes();
    console.log(this.hora, this.minutos);
    setInterval(() => {
      this.hora = moment().hour();
      this.minutos = moment().minutes();
      console.log(this.hora, this.minutos);
    }, 1000 * 60);
  }

  updateUser() {
    this.api.doLogin().then((response) => {
      this.api.saveUser(response);
      this.api.saveData();
      this.api.user = response;
    })
      .catch((err) => {
        console.error(err);
      });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  verTutorial() {
    this.nav.push(TutorialPage);
  }

  verperfil() {
    this.nav.push(ProfilePage);
  }

  verMisPedidos() {
    this.nav.push(PedidosPage);
  }

  cancelarPedido(tipo) {
    var pedido = this.api.pedidos_ayer[tipo];
    this.api.delete('pedidos/' + pedido.id)
      .then((data) => {
        this.alert.create({ buttons: ["OK"], title: "El pedido fue cancelado" }).present();
        this.api.pedidos_ayer[tipo] = null;
      })
      .catch((err) => {
        this.alert.create({ buttons: ["OK"], title: "No se pudo cancelar el pedido" }).present();
        console.error(err);
      });
  }

  logout() {
    this.api.productos = [];
    this.api.user = { token: null };
    this.api.username = "";
    this.api.password = "";
    this.api.carrito = [];
    this.api.storage.clear();
    this.api.tipo = "";
    this.api.categorias = [44, 27, 46, 47, 48, 49, 26, 45, 50, 51, 52, 53];
    this.api.index = 0;
    this.nav.setRoot(LoginPage);
  }

}
