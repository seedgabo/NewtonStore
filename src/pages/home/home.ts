import {LoginPage} from '../login/login';
import {PedidoGuiadoPage} from '../pedido-guiado/pedido-guiado';
import {Api} from '../../providers/Api';
import { Component } from '@angular/core';
import {AlertController, NavController,  NavParams} from 'ionic-angular';
import * as moment from 'moment';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 	loading:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api, public alert:AlertController) {}

  ionViewDidLoad() {
	  this.api.storage.ready()
	  .then(()=>{
			this.api.storage.get("user").then((user:any)=>{
				if(user != undefined){
					this.loading = true;
					this.api.user = JSON.parse(user);
					this.api
					.get(`programacion-pedidos?where[fecha]=${moment().format('Y-MM-DD')}&where[cliente_id]=${this.api.user.cliente_id}`)
					.then((data)=>{
						console.log(data);
						this.navCtrl.setRoot(PedidoGuiadoPage);
					})
					.catch((err)=>{
						if(err.error == 401){
							this.alert.create({title:"Error",message:"Email o contraseña invalidos",buttons: ["Ok"]}).present();
						}else{
							this.alert.create({title:"Error",message:"Error al descargar datos",buttons: ["Ok"]}).present();
						}
					});
				}
				else{
					this.navCtrl.setRoot(LoginPage);
				}
			})
	  });
  }
  


}
