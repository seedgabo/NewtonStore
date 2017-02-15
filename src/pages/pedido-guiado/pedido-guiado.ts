import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    constructor(public navCtrl: NavController, public params: NavParams, public api:Api) {
        var now = moment();
        var almuerzo_inicio = moment().hour(12).minutes(0).seconds(0);
        var almuerzo_final = moment().hour(17).minutes(0).seconds(0);

        var comida_inicio = moment().hour(5).minutes(0).seconds(0);
        var comida_final = moment().hour(12).minutes(0).seconds(0);

        if(moment().isBetween(almuerzo_inicio, almuerzo_final))
            this.servicio = "Almuerzo";
        else if(moment().isBetween(comida_inicio, comida_final))
            this.servicio = "Comida";
        else
            this.servicio = "Cena";
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
        this.siguiente();
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
