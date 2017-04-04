import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { CodePush,InstallMode} from '@ionic-native/code-push';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PedidosPage } from '../pages/pedidos/pedidos';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { Api } from '../providers/Api';
import { HomePage } from "../pages/home/home";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = HomePage;
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

    initializeApp(){
        this.platform.ready().then(() => {
            this.statusbar.styleDefault();
            this.splashscreen.hide();
			if(this.platform.is('android') || this.platform.is('ios')){
				const downloadProgress = (progress) => { console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`); }
				this.codepush.sync({ updateDialog: false, installMode: InstallMode.ON_NEXT_RESUME, }, downloadProgress)
				.subscribe(
					(syncStatus) => {console.log(syncStatus)},
					(err)=>{console.warn(err)}
				);
			}
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
			this.api.productos= [];
			this.api.user={token: null};
			this.api.carrito = [];
			this.api.tipo = "";
			this.api.categorias = [44,27,46,47,48,49,26,45,50,51,52,53];
			this.api.index = 0;
        	this.nav.setRoot(LoginPage);
    }

}
