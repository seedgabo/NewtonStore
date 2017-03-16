import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Api} from '../../providers/Api';
import * as moment from 'moment';
import { VerPedidoPage } from "../ver-pedido/ver-pedido";
@Component({
  selector: 'page-pedidos',
  templateUrl: 'pedidos.html'
})
export class PedidosPage {
  pedidos:any =[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {}

  ionViewDidLoad(){
    this.getmisPedidos();
  }

  getmisPedidos(){
      var user_id = 1;
      this.api.get(`pedidos?where[user_id]=${user_id}&with[]=items.image&with[]=cliente&with[]=invoice`).then((data:any)=>{
          this.pedidos = data.reverse();
          console.log(data);
      });
  }

  verPedido(pedido){
	  this.navCtrl.push(VerPedidoPage ,{pedido:pedido});
  }

}
