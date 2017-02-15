import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen,CodePush,InstallMode } from 'ionic-native';

import { Home } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { PedidosPage } from '../pages/pedidos/pedidos';
import { PedidoGuiadoPage } from '../pages/pedido-guiado/pedido-guiado';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { Api } from '../providers/Api';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any;
    pages: Array<{title: string, component: any, icon:string}>;

    constructor(public platform: Platform,public api:Api) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
                // {title: 'Mi Perfil', component: ProfilePage, icon: 'person'}
            // { title: 'Home', component: Home, icon:'home' },
            // { title: 'Carrito', component: Page2, icon:'cart' },
            // { title: 'Pedidos', component: PedidosPage, icon: 'albums'}
        ];

    }

    initializeApp() {
        this.api.storage.get('user')
        .then((user)=>{
            if(user != undefined)
                this.rootPage = PedidoGuiadoPage;
            else
                this.rootPage = LoginPage;
        });

        this.platform.ready().then(() => {
            StatusBar.styleDefault();
            Splashscreen.hide();
            const downloadProgress = (progress) => { console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`); }
            CodePush.sync({ updateDialog: true, installMode: InstallMode.ON_NEXT_RESUME, }, downloadProgress).subscribe(
                (syncStatus) => console.log(syncStatus),
                (err)=>{console.warn(err)});
            });
    }

    openPage(page) {
            this.nav.setRoot(page.component);
    }

    verperfil(){
        this.nav.push(ProfilePage);
    }

    logout(){
        this.nav.setRoot(LoginPage);
    }

}
