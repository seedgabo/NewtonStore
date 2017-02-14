import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController,ToastController,AlertController } from 'ionic-angular';
import {Api} from '../../providers/Api';
@Component({
    selector: 'page-pedido',
    templateUrl: 'pedido.html'
})
export class PedidoPage {
    productos = [];
    constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api, public loading:LoadingController,public toast:ToastController,public alert:AlertController) {}

    ionViewDidLoad(){
        this.api.carrito.forEach((prod)=>{
            if(prod.id != 0)
                this.productos.push(prod);
        })
    }

    clearCarrito(){
        this.api.clearCarrito()
        .then(()=>{
            this.api.index = 0;
            this.navCtrl.popToRoot();
        });
    }

    processCarrito(){
        var data:any = {items:[]};
        data.user_id = this.api.user.id;
        data.cliente_id = this.api.user.cliente_id;
        data.fecha_envio = (new Date()).toISOString().substring(0,10);
        data.fecha_entrega = (new Date()).toISOString().substring(0,10);
        data.estado = "Pedido";
        this.api.carrito.forEach((prod)=>{
            if(prod.id != 0)
                data.items.push(prod);
        });
        console.log(data);
        var loading = this.loading.create({content:"Procesando Pedido",})
        loading.present();
        this.api.post("pedidos",data)
        .then((data)=>{
            loading.dismiss().then(()=>{
                this.productos = [];
                this.api.clearCarrito();
                this.toast.create({message:"Pedido Procesado",duration:3000}).present();
            });
            console.log(data);
        })
        .catch((err)=>{
            loading.dismiss().then(()=>{
                this.alert.create({title:"Error",message: JSON.stringify(err), buttons:["Ok"] }).present();
            });
        });
    }

}
