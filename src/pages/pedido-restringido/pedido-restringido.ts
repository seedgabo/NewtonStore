import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/Api';
import { PedidoPage } from '../pedido/pedido';
@Component({
    selector: 'page-pedido-restringido',
    templateUrl: 'pedido-restringido.html'
})
export class PedidoRestringidoPage {
    categoria:any={id:39};
    perifericos:Array<any>= [];
    max_pedido = 5;
    constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {

    }

    ionViewDidLoad() {
		var uri = `categorias-productos/${this.categoria.id}&with[]=image&with[]=banner&whereIn[id]=`
		if(this.api.productos != []){
			uri += `&whereIn[id]=${this.api.productos.join()}`;
		}
        this.api.get(uri)
        .then((data)=>{
            this.categoria = data;
            console.log(this.categoria);

        })
        .catch((err)=>{
            console.error(err);
        });

        this.api.get(`productos?where[categoria_id]=${this.categoria.id}&with[]=image`)
        .then((data:any)=>{
            this.perifericos = data;
            this.perifericos.map((per)=>{
                per.valor = 1;
				if(per.id == "17776"){
					per.valor = 4;
				}
                per.cantidad_pedidos = 0;
                return per;
            })

        })
        .catch((err)=>{
            console.error(err);
        });
    }

    increment(per){
        per.cantidad_pedidos++;
        if (this.totalPedido()>this.max_pedido) {
            per.cantidad_pedidos--;
        }
    }

    decrement(per){
        per.cantidad_pedidos--;
        if (per.cantidad_pedidos <0) {
            per.cantidad_pedidos = 0;
        }
    }

    totalPedido(){
        var total = 0;
        this.perifericos.forEach(per => {
            total+= per.valor * per.cantidad_pedidos
        });
        return total;
    }

    pedidoValido(){
        return this.max_pedido >= this.totalPedido();
    }

    atras(){
        if(this.navCtrl.canGoBack()){
            // this.api.index--;
            this.api.removeFromCart(this.api.carrito[this.api.carrito.length -1]);
            this.navCtrl.pop();
        }
    }

    verPedido(){
        this.perifericos.forEach((per)=>{
            if(per.cantidad_pedidos > 0){
                this.api.addToCart(per);
            }
        })
        this.navCtrl.push(PedidoPage);
    }
}
