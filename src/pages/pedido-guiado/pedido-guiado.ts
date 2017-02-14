import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/Api';
import { PedidoRestringidoPage } from '../pedido-restringido/pedido-restringido';
@Component({
    selector: 'page-pedido-guiado',
    templateUrl: 'pedido-guiado.html'
})
export class PedidoGuiadoPage {

    categoria:any = {nombre: "Cargando...", id: 44};
    productos:any = [];
    producto_selected = undefined;
    constructor(public navCtrl: NavController, public params: NavParams, public api:Api) {
    }

    ionViewDidLoad() {
        this.categoria = this.params.get('categoria') != undefined ?this.params.get('categoria') : {nombre: "Cargando...", id: this.api.categorias[this.api.index]};
        console.log(this.categoria);
        this.api.get(`productos?where[active]=1&where[categoria_id]=${this.categoria.id}`)
        .then((data)=>{
            this.productos = data;
            //   console.log(data);
        })
        .catch((err)=>{
            console.error(err);
        });

        this.api.get(`categorias-productos?where[id]=${this.categoria.id}&with[]=banner&with[]=image`)
        .then((data)=>{
            this.categoria = data[0];
            //   console.log(data);
        })
        .catch((err)=>{
            console.error(err);
        });
    }

    selectproducto(producto){
        if (producto == 'none') {
            this.producto_selected = undefined;
        }else{
            this.producto_selected = producto;
        }
    }

    siguiente(){
        if (this.producto_selected != undefined) {
            this.producto_selected.cantidad_pedidos = 1;
            this.api.addToCart(this.producto_selected);
        }else{
            this.api.addToCart({name:"",image_url:"",cantidad_pedidos: 0,id:0, categoria_id:0});
        }
        this.navCtrl.push(PedidoGuiadoPage, {categoria: {id: this.api.categorias[++this.api.index]}}, {animation: "ios-transition"});
    }

    atras(){
        if(this.navCtrl.canGoBack()){
            this.api.index--;
            this.api.removeFromCart(this.api.carrito.length -1);
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
