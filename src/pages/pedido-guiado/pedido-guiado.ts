import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController,AlertController } from 'ionic-angular';
import { Api } from '../../providers/Api';
import { PedidoRestringidoPage } from '../pedido-restringido/pedido-restringido';
import * as moment from 'moment';
@Component({
    selector: 'page-pedido-guiado',
    templateUrl: 'pedido-guiado.html'
})
export class PedidoGuiadoPage {

    categoria:any = {nombre: "Cargando...", id: 44};
    productos:any = [];
    producto_selected = undefined;
    servicio;
	loader = false;
    constructor(public navCtrl: NavController, public params: NavParams, public api:Api, public loading:LoadingController, public alert:AlertController) {
		this.servicio = this.api.tipo;
    }

    ionViewDidLoad() {
        this.categoria = this.params.get('categoria');
		this.productos = this.api.productos.filter((prod)=>{
			if(prod != null)
				return prod.categoria_id == this.categoria.id;
			else 
				return false;
		});
    }

    selectproducto(producto){
        if (producto == 'none') {
            this.producto_selected = undefined;
        }else{
            this.producto_selected = producto;
        }
        if (this.cangoNext())
            this.siguiente();
        else
            this.terminar();
    }

    siguiente(){
        if (this.producto_selected != undefined) {
            this.producto_selected= JSON.parse(JSON.stringify(this.producto_selected));
			this.producto_selected.cantidad_pedidos = 1;
            this.api.addToCart(this.producto_selected);
        }else{
            this.api.addToCart({name:"",image_url:"",cantidad_pedidos: 1,id:0, categoria_id:0});
        }
		console.log(this.api.carrito);
        this.navCtrl.push(PedidoGuiadoPage, {categoria: this.api.categorias[++this.api.index]}, {animation: "ios-transition", duration: 100});
    }

    atras(){
        if(this.navCtrl.canGoBack()){
            if(this.api.index > 0)
				this.api.index--;
			if(this.api.carrito.length > 0)
            	console.log(this.api.removeFromCart(this.api.carrito[this.api.carrito.length -1]));
            this.navCtrl.pop();
        }
    }

    terminar(){
        if (this.producto_selected != undefined) {
            this.producto_selected.cantidad_pedidos = 1;
            this.api.addToCart(this.producto_selected);
        }else{
            this.api.addToCart({name:"",image_url:"",cantidad_pedidos: 0,id:0, categoria_id:0});
        }
        this.navCtrl.push(PedidoRestringidoPage, {}, {animation: "ios-transition"});
    }

    cangoNext(){
        return this.api.categorias.length  > this.api.index+1;
    }

    cangoBack(){
        return this.navCtrl.canGoBack();
    }


}
