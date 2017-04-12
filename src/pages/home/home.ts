import { LoginPage } from '../login/login';
import { PedidoGuiadoPage } from '../pedido-guiado/pedido-guiado';
import { Api } from '../../providers/Api';
import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { TutorialPage } from "../tutorial/tutorial";
import { LocalNotifications } from '@ionic-native/local-notifications';
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	in_horario: boolean = true;
	loading: boolean = false;
	progamacion = {
		almuerzo: undefined,
		comida: undefined,
		cena: undefined,
	}
	status = {
		almuerzo: undefined,
		comida: undefined,
		cena: undefined,
	}
	constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController, public noti:LocalNotifications) { }

	ionViewDidLoad() {
		this.api.storage.ready()
			.then(() => {
				this.api.storage.get("user").then((user: any) => {
					if (user != undefined) {
						this.loading = true;
						this.api.user = JSON.parse(user);
						this.getProgramaciones();
						this.getUser();
					}
					else {
						this.navCtrl.setRoot(LoginPage);
					}
				})

				this.api.storage.get("tutorial").then((dat)=>{
					console.log(dat);
					if(dat == undefined){
						this.api.storage.set("tutorial","true");
						this.navCtrl.push(TutorialPage);
					}
				})
			});
	
	}
	
	getUser() {
		this.api.doLogin().then(
			(response: any) => {
				this.api.user = response;
				if(moment(response.last_login.date).hour() >= 17 ){
					this.in_horario = false;
				}
				this.api.saveUser(response);
				this.api.saveData();
				this.getPedidos();
			}
		)
		.catch((err)=>{
			if (err.error == 401) {
				this.alert.create({ title: "Error", message: "Email o contraseña invalidos", buttons: ["Ok"] }).present();
			} else {
				this.alert.create({ title: "Error", message: "Error al descargar datos", buttons: ["Ok"] }).present();
			}
		})
	}

	getProgramaciones() {
		this.api
			.get(`programacion-pedidos?whereDate[fecha]=${'tomorrow'}&where[cliente_id]=${this.api.user.cliente_id}&afterEach[setProductos]=&afterEach[setCategorias]=`)
			.then((data:any) => {
				console.log(data);
				data.forEach(element => {
					if(element.tipo == "almuerzo")
						this.progamacion.almuerzo = element;
					if(element.tipo == "comida")
						this.progamacion.comida = element;
					if(element.tipo == "cena")
						this.progamacion.cena = element;
				});
			})
			.catch((err) => {
				console.error(err);
				if (err.error == 401) {
					this.alert.create({ title: "Error", message: "Email o contraseña invalidos", buttons: ["Ok"] }).present();
				} else {
					this.alert.create({ title: "Error", message: "Error al descargar datos", buttons: ["Ok"] }).present();
				}
			});
	}

	ordenar(tipo){
		console.log(tipo);
		console.log(this.status[tipo]);
		if( !this.canOrder() ||  !this.in_horario ){
			return;
		}
		this.api.setProgramacion(this.progamacion[tipo]);
		this.api.tipo = tipo;
		this.navCtrl.push(PedidoGuiadoPage, {categoria: this.api.categorias[0]});
	}

	getPedidos(){
		this.api.get("pedidos?whereDateBetween[created_at]=today,tomorrow&where[user_id]="+ this.api.user.id).then(
			(data:Array<any>)=>{
					console.log("pedidos",data);
					this.api.user.pedidos = data;
					this.status ={
						almuerzo : false,
						comida: false,
						cena: false
					};
					data.forEach((pedido)=>{
						if(pedido.tipo == "almuerzo"){
							this.status.almuerzo = true;
						}
						if(pedido.tipo == "comida"){
							this.status.comida = true;
						}
						if(pedido.tipo == "cena"){
							this.status.cena = true;
						}
					});
					this.verifyNotifications();
			}
		).catch(
			(err)=>{
				console.warn(err);
				if (err.error == 401) {
					this.alert.create({ title: "Error", message: "Email o contraseña invalidos", buttons: ["Ok"] }).present();
				} else {
					this.alert.create({ title: "Error", message: "Error al descargar datos", buttons: ["Ok"] }).present();
				}
			}
		)

	}

	canOrder(){
		return (this.status.comida === false   &&  this.status.cena === false   && this.status.almuerzo === false );
	}

	deletePedido(ev,tipo){
		ev.stopPropagation();
		this.alert.create({
			message: "¿Esta seguro de eliminar el pedido?",
			buttons:[
				{
					text: "SI",
					handler: ()=>{
						this._deletePedido(tipo);
					}
				},
				{
					text: "Cancelar",
					handler: ()=>{
						console.log("cancelo");
					}
				}

			]
		}).present();
	}

	_deletePedido(tipo){
		console.log("eliminar pedido", tipo);
		var index;
		var pedido = this.api.user.pedidos.find((ped,i)=>{
			if(ped.tipo == tipo){
				index = i;
				return true;
			}
		})
		this.api.delete("pedidos/"+ pedido.id )
		.then((data)=>{
			this.api.user.pedidos.splice(index, 1);
			this.status[tipo] = false;
		})
		.catch((err)=>{
			this.alert.create({buttons:["OK"],message:"Ocurrió un error al eliminar el pedido"}).present();
		});
	}

	verifyNotifications(){
		this.noti.clearAll();
		if(( this.status.almuerzo === false &&  this.status.comida === false && this.status.cena === false) && moment().hour() < 17){
			this.noti.schedule({
				title: "Haz tu pedido ya!",
				text: 'ya es el momento de realizar el pedido, si aun no lo has hecho',
				at: moment().hour(17).minute(0).toDate(),
				led: 'FF0000',
			});
		}
	}
}
