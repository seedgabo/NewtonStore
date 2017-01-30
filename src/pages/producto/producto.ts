import { Component,ViewChild, } from '@angular/core';
import { NavController, NavParams,Slides,ToastController } from 'ionic-angular';
import {Api} from '../../providers/Api';
import * as $ from 'jQuery';
@Component({
    selector: 'page-producto',
    templateUrl: 'producto.html'
})
export class ProductoPage {
    producto:any={};
    @ViewChild('mySlider') slider: Slides;

    constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api, public toast:ToastController) {
        this.producto = navParams.get("producto");
        if(this.producto.cantidad_pedidos == undefined){
            this.producto.cantidad_pedidos = 1;
        }
        if(this.producto.data != null && !Array.isArray(this.producto.data)){
            this.producto.data = JSON.parse(this.producto.data);
        }
    }

    ionViewDidLoad() {
        this.getProducto();
    }

    getProducto(refresher = undefined){
        this.api.get("productos/" + this.producto.id +"?with[]=image&with[]=images").then((data)=>{
            var pedidos = this.producto.cantidad_pedidos;
            this.producto = data;
            this.producto.cantidad_pedidos = pedidos;
            if(this.producto.data != null &&  !Array.isArray(this.producto.data)){
                this.producto.data = JSON.parse(this.producto.data);
            }
            if(refresher !=undefined ){
                refresher.complete();
            }
            console.log(data);
        }).catch((err)=>{
            console.error("Error al ver el producto",err);
            if(refresher !=undefined ){
                refresher.complete();
            }
        });
    }

    addtoCart(){
        this.api.addToCart(this.producto);
        this.toast.create({message:"Producto Agregado Al Carrito", showCloseButton: true, closeButtonText:"listo" , duration:3000}).present();
        this.navCtrl.pop();
    }


    goToSlide(index) {
        this.slider.slideTo(index, 500);
    }

    addPed(){
        this.producto.cantidad_pedidos ++;
        if(this.producto.cantidad_pedidos < 1)
            this.producto.cantidad_pedidos =1;
        if(!this.producto.es_vendible_sin_stock &&  this.producto.cantidad_pedidos > this.producto.stock)
            this.producto.cantidad_pedidos = this.producto.stock;
    }

    susPed(){
        this.producto.cantidad_pedidos--;
        if(this.producto.cantidad_pedidos < 1)
            this.producto.cantidad_pedidos=1;
        if(this.producto.cantidad_pedidos > this.producto.stock)
            this.producto.cantidad_pedidos = this.producto.stock;
    }

}
