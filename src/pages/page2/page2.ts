import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Api} from '../../providers/Api';
import * as moment from 'moment';

@Component({
    selector: 'page-page2',
    templateUrl: 'page2.html'
})
export class Page2 {

    constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {
    }


    total(){
        var total = 0;
        this.api.carrito.forEach((prod)=>{
            total += prod.cantidad_pedidos * prod.precio;
        })
        return total;
    }

    delete(item,index){
        this.api.carrito.splice(index, 1);
        this.api.storage.set("carrito",JSON.stringify(this.api.carrito));
    }

    processCart(){
        if(!this.validarpedido()){
            return "Error";
        };
        console.log(this.api.carrito);
        var data = {
            cliente_id : 1,
            user_id: 1,
            entidad_id: 1 ,
            estado: 'pedido',
            direccion_envio : "mi direccion",
            direccion_facturado:"mi direccion",
            fecha_pedido: moment().format(),
            items: this.api.carrito,
        }

        this.api.post("pedidos",data).then((response)=>{
            console.log(response);
        })
        .catch((err)=>{
            console.error(err);
        });


    }

    validarpedido(){
        return true;
    }

}
