import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { CodePush,InstallMode } from '@ionic-native/code-push';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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

    constructor(public platform: Platform,public api:Api,
	public codepush:CodePush, public statusbar:StatusBar, public splashscreen:SplashScreen) {
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
            if(user != undefined){
                this.rootPage = PedidoGuiadoPage;
				this.updateUser();
			}
            else
                this.rootPage = LoginPage;
        });

        this.platform.ready().then(() => {
            this.statusbar.styleDefault();
            this.splashscreen.hide();
            const downloadProgress = (progress) => { console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`); }
            this.codepush.sync({ updateDialog: true, installMode: InstallMode.ON_NEXT_RESUME, }, downloadProgress).subscribe(
                (syncStatus) => console.log(syncStatus),
                (err)=>{console.warn(err)});
            });
    }

	updateUser(){
		this.api.doLogin().then((response)=>{
            this.api.saveUser(response);
            this.api.saveData();
            this.api.user = response;
		})
		.catch((err)=>{
			console.error(err);
		});
	}

    openPage(page) {
            this.nav.setRoot(page.component);
    }

    verperfil(){
        this.nav.push(ProfilePage);
    }

	verMisPedidos(){
		this.nav.push(PedidosPage);
	}

    logout(){
        this.nav.setRoot(LoginPage);
    }

}
