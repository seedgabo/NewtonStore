import {VerPedidoPage} from '../ver-pedido/ver-pedido';
import * as moment from 'moment';
import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,LoadingController } from 'ionic-angular';
import { Api  } from '../../providers/Api';
// import { Home } from '../page1/page1';
import { PedidoGuiadoPage } from '../pedido-guiado/pedido-guiado';
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api, public alert:AlertController, public loading:LoadingController) {}

    ionViewDidLoad() {

    }

    doLogin(){
        var loading =this.loading.create({content:"Iniciando Sesión"});
        loading.present();
        this.api.doLogin().then((response:any)=>{
            loading.dismiss();
            if(response.cliente == null){
                this.alert.create({title:"Error",message:"El uso de esta aplicación esta restringido a clientes",buttons: ["Ok"]}).present();
                return
            }
			console.log("last pedido:", response.last_pedido);


            this.api.saveUser(response);
            this.api.saveData()
            this.api.user = response;
            // this.navCtrl.setRoot(Home);
			if (response.last_pedido && moment(response.last_pedido.created_at).isSame(moment(),'day')){
				this.navCtrl.setRoot(VerPedidoPage,{pedido:response.last_pedido});
				return
			}
			this.api
			.get(`programacion-pedidos?where[fecha]=${moment().add(1,'day').format('Y-M-D')}&where[cliente_id]=${this.api.user.cliente_id}`)
			.then((data)=>{
				this.api.setProgramacion(data[0]);
				this.navCtrl.setRoot(PedidoGuiadoPage);
			});
        }).catch((err)=>{
            if(err.error == 401){
                this.alert.create({title:"Error",message:"Email o contraseña invalidos",buttons: ["Ok"]}).present();
            }else{
                this.alert.create({title:"Error",message:"Error al iniciar sesión",buttons: ["Ok"]}).present();
            }
            loading.dismiss();
        })
    }

}
