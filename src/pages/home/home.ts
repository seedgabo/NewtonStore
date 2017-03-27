import {VerPedidoPage} from '../ver-pedido/ver-pedido';
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
						this.getProgramacion();
						this.getUser();
					}
					else{
						this.navCtrl.setRoot(LoginPage);
					}
				})
		});
	}
	getUser(){
		this.api.doLogin().then(
			(response:any)=>{
				console.log("last pedido:", response.last_pedido);
				if (response.last_pedido && moment(response.last_pedido.created_at).isSame(moment(),'day')){
					this.navCtrl.setRoot(VerPedidoPage,{pedido:response.last_pedido});
				}

				this.api.saveUser(response);
				this.api.saveData();
				this.api.user = response;

				if(response.cliente == null){
					this.alert.create({title:"Error",message:"El uso de esta aplicación esta restringido a clientes",buttons: ["Ok"]}).present();
					return
				}
			}
		)
	}
  
  	getProgramacion(){
			this.api
			.get(`programacion-pedidos?where[fecha]=${moment().format('Y-MM-DD')}&where[cliente_id]=${this.api.user.cliente_id}`)
			.then((data)=>{
				console.log(data);
				this.api.setProgramacion(data[0]);
				this.navCtrl.setRoot(PedidoGuiadoPage);
			})
			.catch((err)=>{
				console.error(err);
				if(err.error == 401){
					this.alert.create({title:"Error",message:"Email o contraseña invalidos",buttons: ["Ok"]}).present();
				}else{
					this.alert.create({title:"Error",message:"Error al descargar datos",buttons: ["Ok"]}).present();
				}
			});
	  }





}
