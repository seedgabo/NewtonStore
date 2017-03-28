import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Api} from '../../providers/Api';
import * as moment from 'moment';
@Component({
  selector: 'page-ver-pedido',
  templateUrl: 'ver-pedido.html'
})
export class VerPedidoPage {
	pedido:any;
	tipo= "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {
	this.pedido = navParams.get('pedido');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerPedidoPage');
	this.tipo = this.getTipo(this.pedido.created_at);
	
  }
	getTipo(fecha){
		fecha = moment(fecha);
		var almuerzo_inicio = moment().hour(12).minutes(0).seconds(0);
        var almuerzo_final = moment().hour(17).minutes(0).seconds(0);

        var comida_inicio = moment().hour(5).minutes(0).seconds(0);
        var comida_final = moment().hour(12).minutes(0).seconds(0);

        if(fecha.isBetween(almuerzo_inicio, almuerzo_final))
            return "Almuerzo";
        else if(fecha.isBetween(comida_inicio, comida_final))
            return "Comida";
        else
            return "Cena";
	  }

}
