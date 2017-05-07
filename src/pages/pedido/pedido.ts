import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { VerPedidoPage } from '../ver-pedido/ver-pedido';
import { Api } from '../../providers/Api';
import * as moment from 'moment';
@Component({
	selector: 'page-pedido',
	templateUrl: 'pedido.html'
})
export class PedidoPage {
	productos = [];
	procesado = false;
	entidades = [];
	pedido = null;
	entidad_id;
	sub_entidad_id;
	delivery = "today"
	constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public loading: LoadingController, public toast: ToastController, public alert: AlertController) { }

	ionViewDidLoad() {
		this.api.carrito.forEach((prod) => {
			if (prod.id != 0)
				this.productos.push(prod);
		})
		this.api.get("entidades").then((data: Array<any>) => {
			this.entidades = data;
		}).catch(() => {
			this.alert.create({ message: "Error al cargar las direcciones", buttons: ["Ok"] }).present();
		})

		// this.entidad_id = user.entidad_id;
		console.log(this.entidad_id);
	}

	clearCarrito() {
		this.api.clearCarrito()
			.then(() => {
				this.api.index = 0;
				this.navCtrl.popToRoot();
			});
	}

	atras() {
		this.api.carrito = this.api.carrito.filter((prod) => {
			return prod.categoria_id != 39;
		});
		if (this.api.entidad_ids.indexOf(this.api.user.entidad_id) > -1) {
			console.log(this.api.removeFromCart(this.api.carrito[this.api.carrito.length - 1]));
		}
		this.navCtrl.pop()
	}

	processCarrito() {
		var data: any = { items: [] };
		if (this.entidad_id == undefined) {
			this.alert.create({ message: "Elija una dirección de envió", buttons: ["OK"] }).present();
			return;
		}
		if (this.api.user_selected) {
			var user = this.api.user_selected;
			data.vendedor_id = this.api.user.id;
		} else {
			var user = this.api.user;
		}
		data.user_id = user.id;
		data.entidad_id = user.entidad_id;
		data.cliente_id = user.cliente_id;
		data.fecha_envio = moment().add(1, 'days').toDate().toISOString().substring(0, 10);
		data.fecha_entrega = moment().add(1, 'days').toDate().toISOString().substring(0, 10);
		data.fecha_pedido = moment().add(1, 'days').toDate().toISOString().substring(0, 10);
		if (this.api.cupon && this.delivery == 'today') {
			data.fecha_envio = moment().toDate().toISOString().substring(0, 10);
			data.fecha_entrega = moment().toDate().toISOString().substring(0, 10);
			data.fecha_pedido = moment().toDate().toISOString().substring(0, 10);
		}
		data.entidad_id = this.entidad_id;
		data.direccion_envio = this.getDireccion();
		data.estado = "Pedido";
		data.tipo = this.api.tipo;
		data.facturar = false;
		if (this.api.cupon != undefined) {
			data.cupon_code = this.api.cupon.code;
		}
		this.api.carrito.forEach((prod) => {
			if (prod.id != 0)
				data.items.push(prod);
		});
		console.log(data);
		var loading = this.loading.create({
			content: `
            <div class="loader">
                <img src="${this.api.url + "img/logo.png"}"/>
            </div>
            Procesando Pedido`,
			spinner: 'hide'
		})
		loading.present();
		this.api.post("pedidos", data)
			.then((data) => {
				loading.dismiss().then(() => {
					this.productos = [];
					this.api.clearCarrito();
					this.procesado = true;
					this.pedido = data;
					this.api.cupon = undefined;
					this.toast.create({ message: "Pedido Procesado", duration: 3000 }).present();
					this.navCtrl.setRoot(VerPedidoPage, { pedido: this.pedido });
				});
				this.api.storage.set('last_pedido', moment().format('Y-M-D'));
				console.log(data);
			})
			.catch((err) => {
				loading.dismiss().then(() => {
					this.alert.create({ title: "Error", message: JSON.stringify(err), buttons: ["Ok"] }).present();
				});
			});
	}

	moment(str = null) {
		if (str != null)
			return moment(str);
		else
			return moment();
	}

	verPedido() {
		this.navCtrl.setRoot(VerPedidoPage, { pedido: this.pedido });
	}

	entidadesPadres() {
		return this.entidades.filter((entidad) => {
			return entidad.parent_id == 0 || entidad.parent_id == null;
		});
	}

	entidadesHijo(entidad_id) {
		if (entidad_id == null) {
			return [];
		}
		return this.entidades.filter((entidad) => {
			return entidad.parent_id == entidad_id;
		});
	}

	getDireccion() {
		var entidad = this.entidades.find((ent) => {
			return this.api.user.entidad_id == ent.id;

		});
		return entidad.full_name;
	}

	filterEntidad(entidad_id = null) {
		return this.entidades.filter((ent) => {
			if (entidad_id == null) {
				return ent.parent_id == null || ent.parent_id == 0;
			} else {
				return ent.parent_id == entidad_id
			}
		});
	}

}
