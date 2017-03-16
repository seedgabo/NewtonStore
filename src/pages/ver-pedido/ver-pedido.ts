import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Api} from '../../providers/Api';
@Component({
  selector: 'page-ver-pedido',
  templateUrl: 'ver-pedido.html'
})
export class VerPedidoPage {
	pedido:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {
	this.pedido = navParams.get('pedido');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerPedidoPage');
  }

}
