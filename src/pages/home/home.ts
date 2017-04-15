import { LoginPage } from '../login/login';
import { PedidoGuiadoPage } from '../pedido-guiado/pedido-guiado';
import { Api } from '../../providers/Api';
import { Component } from '@angular/core';
import { ModalController, AlertController, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { TutorialPage } from "../tutorial/tutorial";
import { Selector } from '../selector/selector';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Clipboard } from "@ionic-native/clipboard";
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
	constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController, public modal: ModalController,
		public noti: LocalNotifications, public clipboard:Clipboard) { }

	ionViewDidLoad() {
		this.api.index = 0;
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

				this.api.storage.get("tutorial").then((dat) => {
					console.log(dat);
					if (dat == undefined) {
						this.api.storage.set("tutorial", "true");
						this.navCtrl.push(TutorialPage);
					}
				})
			});

	}

	getUser() {
		this.api.doLogin().then(
			(response: any) => {
				this.api.user = response;
				if (moment(response.last_login.date).hour() >= 17) {
					this.in_horario = false;
				}
				this.api.saveUser(response);
				this.api.saveData();
				this.getPedidos();
			}
		)
			.catch((err) => {
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
			.then((data: any) => {
				console.log(data);
				data.forEach(element => {
					if (element.tipo == "almuerzo")
						this.progamacion.almuerzo = element;
					if (element.tipo == "comida")
						this.progamacion.comida = element;
					if (element.tipo == "cena")
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

	ordenar(tipo) {
		console.log(tipo);
		console.log(this.status[tipo]);
		if (!this.canOrder() || !this.in_horario) {
			return;
		}
		this.api.setProgramacion(this.progamacion[tipo]);
		this.api.tipo = tipo;
		this.navCtrl.push(PedidoGuiadoPage, { categoria: this.api.categorias[0] });
	}

	getPedidos() {
		if (this.api.user_selected) {
			var user = this.api.user_selected;
		} else {
			var user = this.api.user;
		}
		this.api.get("pedidos?whereDateBetween[created_at]=today,tomorrow&where[user_id]=" + user.id).then(
			(data: Array<any>) => {
				console.log("pedidos", data);
				user.pedidos = data;
				this.status = {
					almuerzo: false,
					comida: false,
					cena: false
				};
				data.forEach((pedido) => {
					if (pedido.tipo == "almuerzo") {
						this.status.almuerzo = true;
					}
					if (pedido.tipo == "comida") {
						this.status.comida = true;
					}
					if (pedido.tipo == "cena") {
						this.status.cena = true;
					}
				});
				this.verifyNotifications();
			}
		).catch(
			(err) => {
				console.warn(err);
				if (err.error == 401) {
					this.alert.create({ title: "Error", message: "Email o contraseña invalidos", buttons: ["Ok"] }).present();
				} else {
					this.alert.create({ title: "Error", message: "Error al descargar datos", buttons: ["Ok"] }).present();
				}
			}
			)

	}

	canOrder() {
		return  this.api.cupon || (this.status.comida === false && this.status.cena === false && this.status.almuerzo === false);
	}

	deletePedido(ev, tipo) {
		ev.stopPropagation();
		this.alert.create({
			message: "¿Esta seguro de eliminar el pedido?",
			buttons: [
				{
					text: "SI",
					handler: () => {
						this._deletePedido(tipo);
					}
				},
				{
					text: "Cancelar",
					handler: () => {
						console.log("cancelo");
					}
				}

			]
		}).present();
	}

	_deletePedido(tipo) {
		console.log("eliminar pedido", tipo);
		var index;
		if (this.api.user_selected) {
			var user = this.api.user_selected;
		} else {
			var user = this.api.user;
		}
		var pedido = user.pedidos.find((ped, i) => {
			if (ped.tipo == tipo) {
				index = i;
				return true;
			}
		})
		this.api.delete("pedidos/" + pedido.id)
			.then((data) => {
				user.pedidos.splice(index, 1);
				this.status[tipo] = false;
			})
			.catch((err) => {
				this.alert.create({ buttons: ["OK"], message: "Ocurrió un error al eliminar el pedido" }).present();
			});
	}

	verifyNotifications() {
		this.noti.clearAll();
		if ((this.status.almuerzo === false && this.status.comida === false && this.status.cena === false) && moment().hour() < 17 && !this.api.user.is_vendedor) {
			this.noti.schedule({
				title: "Haz tu pedido ya!",
				text: 'ya es el momento de realizar el pedido, si aun no lo has hecho',
				at: moment().hour(17).minute(0).toDate(),
				led: 'FF0000',
			});
		}
	}

	selectClientes() {
		var modal = this.modal.create(Selector, {
			uri: "users", append: "limit=50&where[cliente_id]=" + this.api.user.cliente_id,
			attributes: ["whereLike[nombre]"],
			image: 'imagen'
		});
		modal.present();
		modal.onWillDismiss((data) => {
			this.status = {
				almuerzo: undefined,
				comida: undefined,
				cena: undefined,
			}
			this.api.user_selected = data.selected;
			this.api.index = 0;
			this.loading = true;
			this.getPedidos();
		});
	}

	askCupon() {
		this.alert.create({
			inputs:[
				{
					label:"# Cupon",
					placeholder: "0000",
					name: "cupon"
				}
			],
			title: "Ingresa tu Cupon",
			buttons: [
				{
					text: "Enviar",
					handler: (data) => {
						console.log(data.cupon);
						this.verCupon(data.cupon);
					}
				}
			]
		}).present();
	}

	verCupon(numero){
		this.api.get("cupones?where[code]="+numero+"&scope[valido]")
		.then((data:Array<any>)=>{
			console.log(data);
			if(data.length !=0){
				this.api.cupon = data[0];
			}else{
				this.alert.create({buttons:["Ok"],message:"cupon invalido"}).present();
			}
		})
		.catch((err)=>{
			this.alert.create({buttons:["Ok"],message:"Error al aplicar el cupon"}).present();
		});
	}

	generateCupon(){
		this.api.post("cupones", {code:null, valido_hasta: moment().startOf('day').add(1,"day").toISOString().substring(0,10)})
		.then((cupon:any)=>{
			this.clipboard.copy(cupon.code);
			this.alert.create({message:"Codigo Cupon",title: cupon.code, subTitle:"Copiado en el  portapapeles",buttons:["OK"]}).present();
		})
		.catch((err)=>{
			this.alert.create({title:"No se pudo generar el cupon", buttons:["OK"]}).present();
		});
	}
}
