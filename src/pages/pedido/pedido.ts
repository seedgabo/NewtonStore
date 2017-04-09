import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController,ToastController,AlertController } from 'ionic-angular';
import {VerPedidoPage} from '../ver-pedido/ver-pedido';
import {Api} from '../../providers/Api';
import * as moment from 'moment';
@Component({
    selector: 'page-pedido',
    templateUrl: 'pedido.html'
})
export class PedidoPage {
    productos = [];
    procesado=false;
	entidades = [];
	pedido = null;
	entidad_id;
    constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api, public loading:LoadingController,public toast:ToastController,public alert:AlertController) {}

    ionViewDidLoad(){
        this.api.carrito.forEach((prod)=>{
            if(prod.id != 0)
                this.productos.push(prod);
        })
		this.api.get("entidades").then((data:Array<any>)=>{
			this.entidades = data;
		}).catch(()=>{
			this.alert.create({message:"Error al cargar las direcciones", buttons:["Ok"]}).present();
		})

		this.entidad_id = this.api.user.entidad_id;
		console.log(this.entidad_id);
    }

    clearCarrito(){
        this.api.clearCarrito()
        .then(()=>{
            this.api.index = 0;
            this.navCtrl.popToRoot();
        });
    }

    atras(){
        this.api.carrito.filter((prod)=>{
            return prod.categoria_id != 39;
        });
        this.navCtrl.pop()
    }

    processCarrito(){
        var data:any = {items:[]};
        data.user_id = this.api.user.id;
		data.entidad_id = this.api.user.entidad_id;
        data.cliente_id = this.api.user.cliente_id;
        data.fecha_envio = (new Date()).toISOString().substring(0,10);
        data.fecha_entrega = (new Date()).toISOString().substring(0,10);
		data.direccion_envio = this.getDireccion(this.entidad_id);
        data.estado = "Pedido";
		data.tipo = this.api.tipo;
		data.facturar = false;
        this.api.carrito.forEach((prod)=>{
            if(prod.id != 0)
                data.items.push(prod);
        });
        console.log(data);
        var loading = this.loading.create({content:`
            <div class="loader">
                <img src="${this.api.url + "img/logo.png"}"/>
            </div>
            Procesando Pedido`,
            spinner:'hide'})
        loading.present();
        this.api.post("pedidos",data)
        .then((data)=>{
            loading.dismiss().then(()=>{
                this.productos = [];
                this.api.clearCarrito();
                this.procesado = true;
				this.pedido = data;
                this.toast.create({message:"Pedido Procesado",duration:3000}).present();
            });
			this.api.storage.set('last_pedido', moment().format('Y-M-D'));
            console.log(data);
        })
        .catch((err)=>{
            loading.dismiss().then(()=>{
                this.alert.create({title:"Error",message: JSON.stringify(err), buttons:["Ok"] }).present();
            });
        });
    }

	verPedido(){
		this.navCtrl.setRoot(VerPedidoPage,{pedido:this.pedido});
	}

	getDireccion(entidad_id){
		var entidad = this.entidades.find((ent)=>{
				return entidad_id  == ent.id;
			});
		return entidad.full_name;
	}

}
