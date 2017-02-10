import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Api} from '../../providers/Api';
@Component({
  selector: 'page-pedido',
  templateUrl: 'pedido.html'
})
export class PedidoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {}

  ionViewDidLoad() {
  }

}
